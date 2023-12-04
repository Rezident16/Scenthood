from .db import db, environment, SCHEMA, add_prefix_for_prod


class OrderProduct(db.Model):
    __tablename__ = 'order_products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=False)
    qty = db.Column(db.Integer)


    item = db.relationship("Item", back_populates='order_products')
    order = db.relationship('Order', back_populates='order_products')

    def to_dict_self(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'order_id': self.order_id,
            'qty': self.qty,
            'item': self.item.to_dict_user_items()
        }
    