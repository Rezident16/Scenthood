from .db import db, environment, SCHEMA, add_prefix_for_prod


class FavoriteProduct(db.Model):
    __tablename__ = 'favorite_products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    # is_favorite = db.Column(db.Boolean, default=False)
    note = db.Column(db.String, nullable=False)

    user = db.relationship('User', back_populates = 'favorites')
    item = db.relationship('Item', back_populates = 'favorites')
