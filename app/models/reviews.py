from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Review (db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=False)
    note = db.Column(db.String)
    stars = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    item = db.relationship('Item', back_populates='reviews')
    order = db.relationship('Order', back_populates='reviews')

    def to_dict_self(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'order_id': self.order_id,
            'note': self.note,
            'stars': self.stars,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
