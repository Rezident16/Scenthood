from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import *
from app.forms import SignUpForm, UpdateUserForm
from .aws_helpers import *

user_routes = Blueprint('users', __name__)

def get_user_by_id(userId):
    return User.query.get(userId)

def validation_errors_to_error_messages(validation_errors):
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

def validate_form(form):
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return form.data
    else:
        return None

def update_user_data(user, data, image):
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    remove_file_from_s3(user.profile_img)
    user.profile_img = upload["url"]

    user.username = data['username']
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.address = data['address']
    user.city = data['city']
    user.state = data['state']
    user.description = data['description']

    db.session.commit()
    return user

@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict_self() for user in users]}

@user_routes.route('/current')
@login_required
def current():
    user = get_user_by_id(current_user.id)
    return user.to_dict_self()

@user_routes.route('/<int:userId>')
def user(userId):
    user = get_user_by_id(userId)
    return user.to_dict_self() if user else None

# this is specifically used for the oauth signup
@user_routes.route('/<int:userId>/edit', methods=["POST"])
# @login_required
def edit_user(userId):
    form = UpdateUserForm()
    form.user_id.data = userId 

    data = validate_form(form)
    if data is None:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401

    user = get_user_by_id(userId)
    if user is None:
        return {"error": "User not found"}, 404

    updated_user = update_user_data(user, data, form.data['profile_img'] if 'profile_img' in form.data else None)
    return updated_user.to_dict_self()

@user_routes.route('/<int:userId>/orders/<int:orderId>')
def order(orderId):
    order = Order.query.get(orderId)
    return order.to_dict_self() if order else None

@user_routes.route('/<int:userId>/orders')
def orders(userId):
    orders = Order.query.filter(Order.user_id == userId).all()
    return [order.to_dict_self() for order in orders]
