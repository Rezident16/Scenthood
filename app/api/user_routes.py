from flask import Blueprint, jsonify, session, request
from flask_login import login_required,current_user
from app.models import User, Order
from app.forms import SignUpForm
from .aws_helpers import *
from app.models import *
from app.forms import *

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict_self() for user in users]}




@user_routes.route('/current')
@login_required
def current(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(current_user.id)
    return user.to_dict_self()

@user_routes.route('/<int:userId>')
def user(userId):
    """
    Query for a user by id and returns that user in a dictionary
    """
    try:
        user = User.query.get(userId)
    except AttributeError:
        return None
    return user.to_dict_self()

@user_routes.route('/<int:userId>/edit', methods=["POST"])
@login_required
def edit_user(userId):
    """
    Edits a user
    """
    form = OauthSignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    user = User.query.get(userId)

    if form.validate_on_submit():
        data = form.data
        image = data['profile_img']
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
        return user.to_dict_self()
    
    if form.errors:
        return form.errors

@user_routes.route('/<int:userId>/orders/<int:orderId>')
def order(orderId):
    try:
        order = Order.query.get(orderId)
    except AttributeError:
        return None
    return order.to_dict_self()

@user_routes.route('/<int:userId>/orders')
def orders(userId):
    try:
        orders = Order.query.filter(Order.user_id == userId).all()
    except AttributeError:
        return None
    return [order.to_dict_self() for order in orders]
