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

    order_products = db.relationship('OrderProduct', back_populates='item', cascade='all, delete-orphan')
    favorites = db.relationship('FavoriteProduct', back_populates='item', cascade='all, delete-orphan')
    owner = db.relationship('User', back_populates='items')
    reviews = db.relationship('Review', back_populates='item', cascade='all, delete-orphan')
