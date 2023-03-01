import os
from datetime import datetime, timedelta
import jwt
from sqlalchemy import Integer
from flask_sqlalchemy import SQLAlchemy
from flask_projects.bloggy.config import Config


database_filename = "database.sqlite3"
project_dir = os.path.dirname(os.path.abspath(__file__))

database_path = "sqlite:///{}".format(os.path.join(project_dir, database_filename))
db = SQLAlchemy()


def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)


def db_drop_and_create_all():
    db.drop_all()
    db.create_all()


class Interest(db.Model):
    __tablename__ = "interested"
    # interest_id = db.Column(Integer().with_variant(Integer, "postgresql"), primary_key=True)
    interest_id = db.Column(Integer().with_variant(Integer, "sqlite"), primary_key=True)
    topic = db.Column(db.String(100))
    description = db.Column(db.String(1000))

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class Article(db.Model):
    __tablename__ = "article"
    # article_id = db.Column(db.Integer().with_variant(Integer, "postgresql"), primary_key=True)
    article_id = db.Column(db.Integer().with_variant(Integer, "sqlite"), primary_key=True)
    interested_id = db.Column(db.Integer, db.ForeignKey('interested.interest_id'), nullable=False)
    title = db.Column(db.String(120))
    content = db.Column(db.String(1000))
    image_url = db.Column(db.String(400))
    auther = db.Column(db.String(100))
    time = db.Column(db.String(100))

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class User(db.Model):
    __tablename__ = "user"

    # user_id = db.Column(db.Integer().with_variant(Integer, "postgresql"), primary_key=True)
    user_id = db.Column(db.Integer().with_variant(Integer, "sqlite"), primary_key=True)
    user_name = db.Column(db.String(100))
    full_name = db.Column(db.String(100))
    age = db.Column(db.String(120))
    country = db.Column(db.String(50))
    profile_image = db.Column(db.String(300))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=0, seconds=5),
                'iat': datetime.utcnow(),
                'sub': user_id

            }
            return jwt.encode(
                payload,
                Config.SECRET_KEY,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            secret_key = Config.SECRET_KEY
            payload = jwt.decode(auth_token, secret_key)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


class InterestedManagement(db.Model):
    # intersed_management_id = db.Column(db.Integer().with_variant(Integer, "postgresql"), primary_key=True)
    intersed_management_id = db.Column(db.Integer().with_variant(Integer, "sqlite"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    interest_id = db.Column(db.Integer, db.ForeignKey('interested.interest_id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.article_id'), nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()
