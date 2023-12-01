from app.models import db, OrderProduct, environment, SCHEMA
from sqlalchemy.sql import text
import csv


# Adds a demo user, you can add other users here if you want
def seed_order_product():
    with open("app/seeds/Order_Product.csv", "r") as file:
        csvreader = csv.reader(file)
        for op_row in csvreader:
            order_product = OrderProduct(
                product_id = int(op_row[0]),
                order_id=int(op_row[1]),
                qty=int(op_row[2]),
            )
            db.session.add(order_product)
            db.session.commit()
    # demo = User(
    #     username='Demo', email='demo@aa.io', password='password', first_name='Demo', last_name='User', address='123 Main St', city='Fake', state='CA')
    # # marnie = User(
    # #     username='marnie', email='marnie@aa.io', password='password')
    # # bobbie = User(
    # #     username='bobbie', email='bobbie@aa.io', password='password')

    # db.session.add(demo)
    # # db.session.add(marnie)
    # # db.session.add(bobbie)
    # db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_order_product():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.order_products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM order_products"))
        
    db.session.commit()
