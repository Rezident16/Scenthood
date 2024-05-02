from flask import Blueprint, jsonify, request, abort
from app.models import *
from flask_login import current_user, login_required
from datetime import datetime
from app.forms import *

review_routes = Blueprint('reviews', __name__)

def get_review(reviewId):
    return Review.query.get(reviewId)

def validate_form(form):
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return form.data
    else:
        return None

def delete_review_from_db(review):
    db.session.delete(review)
    db.session.commit()

@review_routes.route('<int:reviewId>', methods=["DELETE"])
def delete_review(reviewId):
    review = get_review(reviewId)
    if not review:
        return {}

    if review.order.user_id != current_user.id:
        return abort(403, description='Unauthorized')

    delete_review_from_db(review)
    return {"status": "success"}, 200

def update_review_data(review, data):
    review.note = data['note']
    review.stars = data['stars']
    review.updated_at = datetime.now()
    db.session.commit()
    return review

@review_routes.route('<int:reviewId>', methods=["POST"])
def update_review(reviewId):
    review = get_review(reviewId)
    if not review:
        return {}

    form = ReviewForm()
    data = validate_form(form)
    if data is None:
        return form.errors

    if review.order.user_id != current_user.id:
        return abort(403, description='Unauthorized')

    updated_review = update_review_data(review, data)
    return updated_review.to_dict_self(), 200
