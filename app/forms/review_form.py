from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class ReviewForm(FlaskForm):
    note = StringField("review", validators=[DataRequired()])
    stars = IntegerField("stars", validators=[DataRequired(), NumberRange(1,5)])
    submit = SubmitField("submit")
