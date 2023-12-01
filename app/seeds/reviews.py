from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_reviews():
    with open("app/seeds/Reviews.csv", "r") as file:
        csvreader = csv.reader(file)
        for review_row in csvreader:
            review = Review(
                item_id = int(review_row[0]),
                order_id=int(review_row[1]),
                note=(review_row[2]),
                stars=int(review_row[3]),
            )
            db.session.add(review)
            db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()
