from app.models import db, Item, environment, SCHEMA
from sqlalchemy.sql import text
import csv


# Adds a demo user, you can add other users here if you want
def seed_items():
    with open("app/seeds/Items.csv", "r") as file:
        csvreader = csv.reader(file)
        for item_row in csvreader:
            item = Item(
                owner_id = int(item_row[0]),
                name=(item_row[1]),
                brand=(item_row[2]),
                description=(item_row[3]),
                price=float(item_row[4]),
                preview_img=(item_row[5]),
                available_qty=(item_row[6]),
            )
            db.session.add(item)
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
def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))
        
    db.session.commit()
