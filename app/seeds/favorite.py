from app.models import db, FavoriteProduct, environment, SCHEMA
from sqlalchemy.sql import text
import csv


# Adds a demo user, you can add other users here if you want
def seed_favorites():
    with open("app/seeds/Favorite.csv", "r") as file:
        csvreader = csv.reader(file)
        for fav_row in csvreader:
            fav = FavoriteProduct(
                user_id = int(fav_row[0]),
                product_id=int(fav_row[1]),
            )
            db.session.add(fav)
            db.session.commit()
def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorite_products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorite_products"))
        
    db.session.commit()
