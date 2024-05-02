from flask import Blueprint, jsonify, request, abort
from app.models import *
from flask_login import current_user, login_required
from datetime import datetime
from app.forms import *

order_routes = Blueprint('orders', __name__)

def validate_form(form):
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return form.data
    else:
        return None

def create_order(data, items):
    new_order = Order (
        user_id = current_user.id,
        address = data['address'],
        city = data['city'],
        state = data['state'],
    )
    order_products = list()
    price = 0
    for item in items:
        new_order_product = OrderProduct(
            product_id = item['id'],
            order_id = new_order.id,
            qty = item['qty']
        )
        price += item['price'] * item['qty']

        order_products.append(new_order_product)
        db.session.add(new_order_product)

    new_order.order_products = order_products
    new_order.price = price
    db.session.add(new_order)
    db.session.commit()
    return new_order

@order_routes.route('', methods=["POST"])
@login_required
def post_order():
    form = OrderForm()
    data = validate_form(form)
    if data is None:
        return form.errors

    req = request.get_json()
    items = req['items']
    new_order = create_order(data, items)
    return new_order.to_dict_self()

def create_review(data, orderId, itemId):
    new_review = Review (
        item_id = itemId,
        order_id = orderId,
        note = data['note'],
        stars = data['stars'],
        created_at = datetime.now(),
        updated_at = datetime.now()
    )
    db.session.add(new_review)
    db.session.commit()
    return new_review

@order_routes.route('/<int:orderId>/items/<int:itemId>/reviews', methods=["POST"])
@login_required
def post_review(orderId, itemId):
    form = ReviewForm()
    data = validate_form(form)
    if data is None:
        return form.errors

    order = Order.query.get(orderId)
    if not order:
        return {}

    if order.user_id != current_user.id:
        return abort(403, description='Unauthorized')

    existing_review = Review.query.filter_by(item_id=itemId, order_id = orderId).first()
    if existing_review is not None:
        return abort(400, description="User already has review for this item in this order")

    new_review = create_review(data, orderId, itemId)
    return new_review.to_dict_self()
