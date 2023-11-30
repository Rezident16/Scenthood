from .db import db, environment, SCHEMA, add_prefix_for_prod

class Order (db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime)

    order_products = db.relationship('OrderProduct', back_populates='order', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='orders')
    reviews = db.relationship('Review', back_populates='order')

    def to_dict_self(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'created_at': self.created_at,
            'order_prodcts': [order.to_dict_self() for order in self.order_products]
        }
