from flask import Blueprint, session, request, abort, redirect
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from .aws_helpers import *
from flask_login import current_user, login_user, logout_user, login_required
from oauthlib.oauth2.rfc6749.errors import AccessDeniedError
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import os
import requests
import json
from tempfile import NamedTemporaryFile
from flask_wtf.csrf import generate_csrf


auth_routes = Blueprint('auth', __name__)

# OAUTH
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
CLIENT_ID = os.getenv('CLIENT_ID')
BASE_URL = os.getenv('BASE_URL')
REACT_APP_BASE_URL = os.getenv('REACT_APP_BASE_URL')

def create_client_secrets():
    client_secrets = {
        "web": {
            "client_id": CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": CLIENT_SECRET,
            "redirect_uris": [
                f"{BASE_URL}/api/auth/callback"
            ]
        }
    }
    return client_secrets

def create_flow(client_secrets):
    secrets = NamedTemporaryFile()
    with open(secrets.name, "w") as output:
        json.dump(client_secrets, output)

    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    flow = Flow.from_client_secrets_file(
        client_secrets_file=secrets.name,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri=f"{BASE_URL}/api/auth/callback"
    )

    secrets.close()
    return flow

client_secrets = create_client_secrets()
flow = create_flow(client_secrets)

def validation_errors_to_error_messages(validation_errors):
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

def validate_and_submit_form(form):
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return True
    return False

def upload_profile_image(image):
    image.filename = get_unique_filename(image.filename)
    return upload_file_to_s3(image)

def create_new_user(form, profile_img_url):
    user = User(
        username=form.data['username'],
        email=form.data['email'],
        password=form.data['password'],
        first_name = form.data['first_name'].title(),
        last_name = form.data["last_name"].title(),
        address = form.data['address'],
        city = form.data['city'].title(),
        state = form.data['state'],
        profile_img = profile_img_url,
        description = form.data['description']
    )
    return user

def add_user_to_db(user):
    db.session.add(user)
    db.session.commit()
    return user

@auth_routes.route('/')
def authenticate():
    if current_user.is_authenticated:
        return current_user.to_dict_self()
    return {'errors': ['Unauthorized']}

@auth_routes.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    if validate_and_submit_form(form):
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict_self()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@auth_routes.route('/logout')
def logout():
    logout_user()
    return {'message': 'User logged out'}

@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm()
    if validate_and_submit_form(form):
        profile_img_url = upload_profile_image(form.data['profile_img'])
        user = create_new_user(form, profile_img_url)
        user = add_user_to_db(user)
        login_user(user)
        return user.to_dict_self()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@auth_routes.route('/unauthorized')
def unauthorized():
    return {'errors': ['Unauthorized']}, 401

@auth_routes.route('/google/key')
def get_key():
    return {'key': os.environ.get('REACT_APP_GOOGLE_MAPS_API_KEY')}

@auth_routes.route("/oauth_login")
def oauth_login():
    authorization_url, state = flow.authorization_url(prompt="select_account consent")
    referrer = request.headers.get('Referer')
    session["referrer"] = referrer
    session["state"] = state
    return redirect(authorization_url)

@auth_routes.route("/callback")
def callback():
    try:
        flow.fetch_token(authorization_response=request.url)
        print("sign up route")
        # This is our CSRF protection for the Oauth Flow!
        if not session["state"] == request.args["state"]:
            abort(500)  # State does not match!

        credentials = flow.credentials
        request_session = requests.session()
        cached_session = cachecontrol.CacheControl(request_session)
        token_request = google.auth.transport.requests.Request(session=cached_session)

        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=CLIENT_ID
        )

        temp_email = id_info.get('email')
        user_exists = User.query.filter(User.email == temp_email).first()

        if not user_exists:
            email_arr = temp_email.split('@')
            user_exists = User(
                    first_name=id_info.get("given_name"),
                    last_name=id_info.get("family_name"),
                    email=temp_email,
                    password='OAUTH',
                    username=email_arr[0],
                    address = "None",
                    city = "None",
                    state = "None",
                    profile_img = "https://scenthood.s3.us-east-2.amazonaws.com/generic.png",
                    description = "None"
                )

            db.session.add(user_exists)
            db.session.commit()
        login_user(user_exists)

        if user_exists.address != "None":
            return redirect(f"{REACT_APP_BASE_URL}/")
        else:
            csrf_token = generate_csrf()
            session['csrf_token'] = csrf_token
            response = redirect(f"{REACT_APP_BASE_URL}/complete")
            response.set_cookie('csrf_token', csrf_token)
            return response
    except AccessDeniedError:
        return redirect(REACT_APP_BASE_URL)
