import re
from werkzeug.security import generate_password_hash, check_password_hash
from flask import (Blueprint, session)
from flask import request, jsonify, make_response
from ..database.model import *

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    """
    Login request
    :return:
    """
    post_data = request.get_json()
    response = {
        "success": False,
        "message": "Invalid parameters"
    }
    try:

        user = User.query.filter_by(email=post_data.get('email')).first()
        # fetch the user data
        if user and check_password_hash(user.password, post_data.get('password')):

            auth_token = user.encode_auth_token(user.user_id)
            if auth_token:
                response["success"] = True
                response["message"] = "Successfully Login"
                response["user"] = user.user_name
                return make_response(response, 200)

        else:
            response["message"] = "User does not exist."

            return make_response(response, 404)
    except Exception as e:

        responseObject = {
            'status': 'fail',
            'message': 'Try again'
        }
        return make_response(jsonify(responseObject)), 500


@auth.route("/signup", methods=["POST", "GET"])
def signup():
    """
    Register system
    :return:
    """
    # get the post data
    post_data = request.get_json()
    # check if user already exists

    response = {
        "success": False,
        "message": "Invalid parameters"
    }
    try:
        name, email = post_data.get('username'), post_data.get('email')
        user = User.query.filter_by(email=email).first()
        password = post_data.get('password')
        if name is None or email is None or password is None:
            return make_response(response, 202)
        if not check_email(email):
            response["message"] = "Invalid email "
            return make_response(jsonify(response), 202)

        if not user:
            new_user = User(user_name=name, email=email, password=generate_password_hash(password))
            new_user.insert()
            response["success"] = True
            response["message"] = 'Successfully registered'
            return jsonify(response), 200
        else:
            response["message"] = 'User already exists. Please Log in'
            return make_response(response, 202)
    except Exception as e:
        print(e)
        return make_response(response, 422)


@auth.route("/users/<string:user_name>", methods=["POST", "GET"])
def user(user_name):
    """
    Send information about user
    :param user_name:
    :return:
    """
    try:
        users = [user.user_name for user in User.query.all()]
        if user_name in users:
            user = User.query.filter_by(user_name=user_name).first()
            user_info = {
                "email": user.email,
                "full_name": user.full_name,
                "image": user.profile_image,
                "age": user.age,
                "country": user.country
            }
            return jsonify(user_info), 200
        else:
            return ""

    except Exception as e:
        print(e)


@auth.route("/users/<string:user_name>/settings", methods=["POST"])
def settings(user_name):
    """
    Update settings
    :param user_name:
    :return:
    """
    try:
        user = User.query.filter_by(user_name=user_name).first()
        user_info = request.get_json()
        if session.get("filepath") is not None or session.get("filepath") == "":
            profile_image = "http://" + request.host + (session.get("profile"))
            user.profile_image = profile_image
        else:
            profile_image = ""
            user.profile_image = profile_image
        country = user_info.get("country")
        age = user_info.get("age")
        full_name = user_info.get("fullname")
        email = user_info.get("email")
        password = user_info.get("password")
        if country is not None or country != "":
            user.country = country
        if age is not None or age != "":
            user.age = age
        if full_name is not None or full_name != "":
            user.full_name = full_name

        if password is not None or password != "":
            user.password = generate_password_hash(password)

        if email is not None or email != "":
            if check_email(email):
                user.email = email
        user.update()
        return jsonify({"success": True, "user": user_name}), 200
    except Exception as e:
        print(e)


@auth.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Connection"] = "keep-alive"
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Headers', 'GET, POST, PATCH, DELETE, OPTION')
    return response


# Utils
def check_email(email):
    """
    Check if email or not
    :param email:
    :return:
    """
    EMAIL_REGEX = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    if re.search(EMAIL_REGEX, email):
        return True
    else:
        return False
