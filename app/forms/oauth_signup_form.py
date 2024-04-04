from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User




IMAGE_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

class OauthSignUpForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    first_name = StringField("First Name", validators=[DataRequired()])
    last_name = StringField("Last Name", validators=[DataRequired()])
    address = StringField("Address", validators=[DataRequired()])
    city = StringField('City', validators=[DataRequired()])
    state = StringField("State", validators=[DataRequired()])
    profile_img = FileField('Profile Image', validators=[FileAllowed(list(IMAGE_EXTENSIONS))])
    description = StringField('Description')
    submit = SubmitField("submit")
