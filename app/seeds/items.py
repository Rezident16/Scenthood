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

def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))
        
    db.session.commit()
