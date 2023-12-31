from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
import csv


# Adds a demo user, you can add other users here if you want
def seed_users():
    with open("app/seeds/Users.csv", "r") as file:
        csvreader = csv.reader(file)
        for user_row in csvreader:
            user = User(
                username = (user_row[0]),
                email=(user_row[1]),
                password=(user_row[2]),
                first_name=(user_row[3]),
                last_name=(user_row[4]),
                address=(user_row[5]),
                city=(user_row[6]),
                state=(user_row[7]),
                profile_img=(user_row[8]),
                description=(user_row[9])
            )
            db.session.add(user)
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
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
