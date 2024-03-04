from flask import Blueprint, jsonify, request, abort, request
from app.models import *
from flask_login import current_user, login_required
from datetime import time, datetime, date
from app.forms import *
from .aws_helpers import *

item_routes = Blueprint('items', __name__)

# Get all items
@item_routes.route("")
def get_all_items():
    """Get All Items"""
    items = Item.query.all()
    return {"Items": [item.to_dict_owner() for item in items]}



# Get items by page and count
@item_routes.route('page/<int:page>/count/<int:items_per_page>', methods=['GET'])
def get_items_query(page, items_per_page):
    start_index = (page - 1) * items_per_page
    end_index = start_index + items_per_page
    # Query only the items for this page
    items = Item.query.slice(start_index, end_index).all()

    # Convert items to a format that can be jsonified
    return {"Items": [item.to_dict_owner() for item in items]}

# Get one item
@item_routes.route('/<int:itemId>')
def get_item(itemId):
    """Get One Item"""
    item = Item.query.get(itemId)
    if not item:
        # return abort(404, description='Item not found')
        return {}
    return item.to_dict_owner()

# Create an item
@item_routes.route('', methods=["POST"])
@login_required
def post_item():
    """Create an item"""
    form = ItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        image = data['preview_img']
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if 'url' not in upload:
            return {'errors': upload}, 500
        
        new_item = Item (
            owner_id = current_user.id,
            name = data['name'],
            brand = data['brand'],
            description = data['description'],
            price = data['price'],
            preview_img = upload['url'],
            available_qty = data['available_qty']
        )

        db.session.add(new_item)
        db.session.commit()
        return new_item.to_dict_owner(), 200
    
    if form.errors:
        return form.errors
    
# Update an Item
@item_routes.route('/<int:itemId>', methods=["POST"])
@login_required
def update_item(itemId):
    """Update an Item"""
    item = Item.query.get(itemId)

    if not item:
        # return abort(404, description='Item not found')
        return {}
    form = ItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        # if item.owner_id != current_user.id:
        #     return abort(403, description='Unauthorized')
        # need to update the quantity on purchase, therefore should be allowed for now
        
        if data["preview_img"]:
            image = data['preview_img']
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)

            if "url" not in upload:
                # return render_template("restaurant_form.html", form=form, errors=upload)
                return { 'errors': upload }, 500
            else :
                remove_file_from_s3(item.preview_img)
                item.preview_img = upload["url"]
        
        item.name = data['name']
        item.brand = data['brand']
        item.description = data['description']
        item.price = data['price']
        item.available_qty = data['available_qty']

        db.session.commit()

        return item.to_dict_owner(), 200
    
    if form.errors:
        return form.errors

# Delete an Item
@item_routes.route('/<int:itemId>', methods=["DELETE"])
@login_required
def delete_item(itemId):
    item = Item.query.get(itemId)

    if not item:
        return {}
    
    if item.owner_id != current_user.id:
        return abort(403, description='Unauthorized')
    
    db.session.delete(item)
    db.session.commit()

    return {"status": "success"}, 200


# Create Favorite items/:id/favorite
@item_routes.route('/<int:itemId>/favorites', methods=['POST'])
@login_required
def favorite_item(itemId):
    item = Item.query.get(itemId)

    if not item:
        return {}
    
    existing_favorite = FavoriteProduct.query.filter_by(product_id=itemId, user_id = current_user.id).first()

    if existing_favorite is not None:
        return abort(400, description="User already has favorited this item")

    form = FavoriteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    data = form.data

    if form.validate_on_submit():
        new_favorite = FavoriteProduct(
            user_id = current_user.id,
            product_id = itemId,
            note = data['note']
        )
        db.session.add(new_favorite)
        db.session.commit()
        return new_favorite.to_dict_self()

    if form.errors:
        return form.errors
