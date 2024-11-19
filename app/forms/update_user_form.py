from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user_id = form.user_id.data
    user = User.query.filter(User.email == email, User.id != user_id).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user_id = form.id.data
    user = User.query.filter(User.username == username, User.id != user_id).first()
    if user:
        raise ValidationError('Username is already in use.')

IMAGE_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

class UpdateUserForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists, Email("Please enter a valid email")])
    password = StringField('password', validators=[DataRequired()])
    first_name = StringField("First Name", validators=[DataRequired()])
    last_name = StringField("Last Name", validators=[DataRequired()])
    address = StringField("Address", validators=[DataRequired()])
    city = StringField('City', validators=[DataRequired()])
    state = StringField("State", validators=[DataRequired()])
    profile_img = FileField('Profile Image', validators=[FileAllowed(list(IMAGE_EXTENSIONS))])
    description = StringField('Description')
    submit = SubmitField("submit")
