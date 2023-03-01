from logging import Formatter, FileHandler
import logging

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.database.model import *
from datetime import timedelta
from flask_session import Session


db = SQLAlchemy()


def handler_error(app):
    if not app.debug:
        file_handler = FileHandler('error.log')
        file_handler.setFormatter(
            Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
        )
        app.logger.setLevel(logging.INFO)
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.info('errors')


def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    setup_db(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, resources={r"/": {"origins": '*'}})

    #Session

    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=5)

    Session(app)

    ########
    # file #
    ########
    # file Upload
    app.config['UPLOAD_FOLDER'] = Config.static_path()
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['UPLOAD_EXTENSIONS'] = ['png', 'jpg', 'jpeg', 'gif']


    Migrate(app, db)
    # db_drop_and_create_all()
    app.config.from_object(Config)
    from app.auth.auth import auth
    from flask_projects.bloggy.app.API.api import article
    from app.file_app.file import files
    app.register_blueprint(auth)
    app.register_blueprint(article)
    app.register_blueprint(files)
    handler_error(app)
    return app
