# delete favorite /favorites/:id

from flask import Blueprint, jsonify, request, abort, request
from app.models import *
from flask_login import current_user, login_required
from datetime import time, datetime, date
from app.forms import *
from .aws_helpers import *

favorite_routes = Blueprint('favorites', __name__)

@favorite_routes.route('/<int:favId>', methods=['DELETE'])
@login_required
def delete_fav(favId):
    item = FavoriteProduct.query.get(favId)
    if not item:
        return {}
    
    if item.user_id != current_user.id:
        return abort(403, description='Unauthorized')
    
    db.session.delete(item)
    db.session.commit()

    return {"status": "success"}, 200 
# update favorite /favorites/:id
@favorite_routes.route('/<int:favId>', methods=["POST"])
@login_required
def update_fav(favId):
    item = FavoriteProduct.query.get(favId)

    if not item:
        return {}

    form = FavoriteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        if item.user_id != current_user.id:
            return abort(403, description='Unauthorized')
        
        item.note = data['note']

        db.session.commit()

        return item.to_dict_self(), 200
    
    if form.errors:
        return form.errors
