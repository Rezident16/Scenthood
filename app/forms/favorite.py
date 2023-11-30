from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired

class FavoriteForm(FlaskForm):
    note = TextAreaField("note", validators=[DataRequired()])
