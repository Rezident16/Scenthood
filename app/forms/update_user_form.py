from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField
from wtforms.validators import DataRequired, ValidationError
from ..models import User

def user_exists(form, field):
    email = field.data
    user_id = form.user_id.data
    user = User.query.filter(User.email == email, User.id != user_id).first()
    if user:
        raise ValidationError('Email address is already in use.')

def username_exists(form, field):
    username = field.data
    user_id = form.user_id.data
    user = User.query.filter(User.username == username, User.id != user_id).first()
    if user:
        raise ValidationError('Username is already in use.')

class UpdateUserForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    username = StringField('username', validators=[username_exists])
    email = StringField('email', validators=[user_exists])
    first_name = StringField('first_name')
    last_name = StringField('last_name')
    address = StringField('address')
    city = StringField('city')
    state = StringField('state')
    profile_img = FileField('profile_img')
    description = StringField('description')
