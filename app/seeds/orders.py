from app.models import db, Order, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_orders():
    with open("app/seeds/Orders.csv", "r") as file:
        csvreader = csv.reader(file)
        for order_row in csvreader:
            order = Order(
                user_id = int(order_row[0]),
                address=(order_row[1]),
                city=(order_row[2]),
                state=(order_row[3]),
            )
            db.session.add(order)
            db.session.commit()

def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))
        
    db.session.commit()
