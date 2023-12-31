from .db import db, environment, SCHEMA, add_prefix_for_prod


class Item(db.Model):
    __tablename__ = 'items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String, nullable=False)
    brand = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    preview_img = db.Column(db.String)
    available_qty = db.Column(db.Integer)

    order_products = db.relationship('OrderProduct', back_populates='item', cascade='all, delete-orphan')
    favorites = db.relationship('FavoriteProduct', back_populates='item', cascade='all, delete-orphan')
    owner = db.relationship('User', back_populates='items')
    reviews = db.relationship('Review', back_populates='item', cascade='all, delete-orphan')

    def to_dict_self(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'brand': self.brand,
            'description': self.description,
            'price': self.price,
            'preview_img': self.preview_img,
            'available_qty': self.available_qty,
            
        }
    
    def to_dict_owner(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'brand': self.brand,
            'description': self.description,
            'price': self.price,
            'preview_img': self.preview_img,
            'available_qty': self.available_qty,
            'owner': self.owner.to_dict_self(),
            'reviews': [review.to_dict_self() for review in self.reviews],
            'order_products': [order.to_dict_self() for order in self.order_products],
            'favorites': [favorite.to_dict_self() for favorite in self.favorites]
        }
    
    def to_dict_user_items(self): 
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'brand': self.brand,
            'description': self.description,
            'price': self.price,
            'preview_img': self.preview_img,
            'available_qty': self.available_qty,
            'reviews': [review.to_dict_user_items() for review in self.reviews],
        }
