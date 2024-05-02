from flask import Blueprint, jsonify, request, abort, request
from app.models import *
from flask_login import current_user, login_required
from datetime import time, datetime, date
from app.forms import *
from .aws_helpers import *

item_routes = Blueprint('items', __name__)

def get_items():
    return Item.query.all()

@item_routes.route("")
def get_all_items():
    """Get All Items"""
    items = get_items()
    return {"Items": [item.to_dict_owner() for item in items]}

def get_items_by_page(page, items_per_page):
    start_index = (page - 1) * items_per_page
    end_index = start_index + items_per_page
    return Item.query.slice(start_index, end_index).all()

@item_routes.route('page/<int:page>/count/<int:items_per_page>', methods=['GET'])
def get_items_query(page, items_per_page):
    items = get_items_by_page(page, items_per_page)
    return {"Items": [item.to_dict_owner() for item in items]}

def get_single_item(itemId):
    return Item.query.get(itemId)

@item_routes.route('/<int:itemId>')
def get_item(itemId):
    """Get One Item"""
    item = get_single_item(itemId)
    if not item:
        return {}
    return item.to_dict_owner()

def validate_form(form):
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return form.data
    else:
        return None

def upload_image(data):
    image = data['preview_img']
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    if 'url' not in upload:
        return None, upload
    return upload['url'], None

def create_item(data, image_url):
    new_item = Item (
        owner_id = current_user.id,
        name = data['name'],
        brand = data['brand'],
        description = data['description'],
        price = data['price'],
        preview_img = image_url,
        available_qty = data['available_qty']
    )
    db.session.add(new_item)
    db.session.commit()
    return new_item

@item_routes.route('', methods=["POST"])
@login_required
def post_item():
    """Create an item"""
    form = ItemForm()
    data = validate_form(form)
    if data is None:
        return form.errors

    image_url, upload = upload_image(data)
    if image_url is None:
        return {'errors': upload}, 500

    new_item = create_item(data, image_url)
    return new_item.to_dict_owner(), 200

def update_item_data(item, data, image_url):
    if image_url:
        remove_file_from_s3(item.preview_img)
        item.preview_img = image_url

    item.name = data['name']
    item.brand = data['brand']
    item.description = data['description']
    item.price = data['price']
    item.available_qty = data['available_qty']

    db.session.commit()
    return item

@item_routes.route('/<int:itemId>', methods=["POST"])
@login_required
def update_item(itemId):
    """Update an Item"""
    item = get_single_item(itemId)
    if not item:
        return {}

    form = ItemForm()
    data = validate_form(form)
    if data is None:
        return form.errors

    image_url = None
    if data["preview_img"]:
        image_url, upload = upload_image(data)
        if image_url is None:
            return { 'errors': upload }, 500

    updated_item = update_item_data(item, data, image_url)
    return updated_item.to_dict_owner(), 200

def delete_item_from_db(item):
    db.session.delete(item)
    db.session.commit()

@item_routes.route('/<int:itemId>', methods=["DELETE"])
@login_required
def delete_item(itemId):
    item = get_single_item(itemId)
    if not item:
        return {}
    
    if item.owner_id != current_user.id:
        return abort(403, description='Unauthorized')
    
    delete_item_from_db(item)
    return {"status": "success"}, 200

def create_favorite_item(itemId):
    existing_favorite = FavoriteProduct.query.filter_by(product_id=itemId, user_id = current_user.id).first()
    if existing_favorite is not None:
        return None

    new_favorite = FavoriteProduct(
        user_id = current_user.id,
        product_id = itemId,
    )
    db.session.add(new_favorite)
    db.session.commit()
    return new_favorite

@item_routes.route('/<int:itemId>/favorites', methods=['POST'])
@login_required
def favorite_item(itemId):
    item = get_single_item(itemId)
    if not item:
        return {}
    
    new_favorite = create_favorite_item(itemId)
    if new_favorite is None:
        return abort(400, description="User already has favorited this item")

    return new_favorite.to_dict_self()
