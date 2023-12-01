from flask import Blueprint, jsonify, request, abort, request
from app.models import *
from flask_login import current_user, login_required
from datetime import time, datetime, date
from app.forms import *
from .aws_helpers import *

review_routes = Blueprint('reviews', __name__)

# Delete Review reviews/:id
@review_routes.route('<int:reviewId>', methods=["DELETE"])
def delete_review(reviewId):
    review = Review.query.get(reviewId)

    if not review:
        return {}
    
    if review.order.user_id != current_user.id:
        return abort(403, description='Unauthorized')
    
    db.session.delete(review)
    db.session.commit()

    return {"status": "success"}, 200
# Update Review reviews/:id
@review_routes.route('<int:reviewId>', methods=["POST"])
def update_review(reviewId):
    review = Review.query.get(reviewId)

    if not review:
        return {}
    
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        if review.order.user_id != current_user.id:
            return abort(403, description='Unauthorized')
    
        review.note = data['note']
        review.stars = data['stars']
        
        db.session.commit()
        return review.to_dict_self(), 200
    
    if form.errors:
        return form.errors
