from flask import Blueprint, jsonify, request, abort, request
from app.models import *
from flask_login import current_user, login_required
from datetime import time, datetime, date
from app.forms import *
from .aws_helpers import *

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=["POST"])
@login_required
def create_order():
    form = OrderForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        new_order = Order (
            user_id = current_user.id,
            address = data['address'],
            city = data['city'],
            state = data['state'],
            # created_at = datetime.now()
        )
        req = request.get_json()
        items = req['items']
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
        return new_order.to_dict_self()
    if form.errors:
        return form.errors

@order_routes.route('/<int:orderId>/items/<int:itemId>/reviews', methods=["POST"])
@login_required
def create_review(orderId, itemId):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    order = Order.query.get(orderId)

    existing_review = Review.query.filter_by(item_id=itemId, order_id = orderId).first()

    if existing_review is not None:
        return abort(400, description="User already has review for this item in this order")

    if not order:
        return {}
    
    if order.user_id != current_user.id:
        return abort(403, description='Unauthorized')
    
    if form.validate_on_submit():
        data= form.data

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
        return new_review.to_dict_self()
    if form.errors:
        return form.errors
