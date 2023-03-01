"""
from flask import Flask, app
from flask_cors import CORS



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, resources={r"/": {"origins": '*'}})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Headers', 'GET, POST, PATCH, DELETE, OPTION')
        return response


create_app()
"""