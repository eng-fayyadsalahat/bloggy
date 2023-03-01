import os.path
from flask import jsonify, request, make_response
from werkzeug.utils import secure_filename
from flask import (Blueprint, session)
from flask_projects.bloggy.config import Config

files = Blueprint("file", __name__, static_folder="static")

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@files.route("/upload", methods=["POST"])
def upload_file():
    """
    Upload file from frontend
    Get file and store it
    :return:
    """
    if request.method == 'POST':
        # check if the post request has the file part
        try:
            if 'file' not in request.files:
                data = {
                    "success": False,
                    "data": {
                        "message": "No file part"
                    }
                }
                return make_response(jsonify(data), 200)
            file = request.files['file']
            if file.filename == '':
                data = {
                    "success": False,
                    "data": {
                        "message": "No file selected for uploading"
                    }
                }
                return make_response(jsonify(data), 200)

            if file and allowed_file(file.filename):
                session["filepath"] = ""
                session["profile"] = ""
                filename = secure_filename(file.filename)
                if request.form["request_type"] == "write":
                    path_of_file = (os.path.join(Config.static_path(), filename))
                    path = os.getcwd() + path_of_file
                    file.save(path)
                    session["filepath"] = path_of_file
                elif request.form["request_type"] == "profile":
                    path_of_file = (os.path.join((Config.static_path() + "/users/"), filename))
                    path = os.getcwd() + path_of_file
                    file.save(path)
                    session["profile"] = path_of_file
                data = {
                    "success": True,
                    "data": {
                        "message": "File successfully uploaded"
                    }
                }
                return make_response(jsonify(data), 200)

            else:
                data = {
                    "success": False,
                    "data": {
                        "message": "Allowed file types are png, jpg, jpeg, gif"
                    }
                }
                return make_response(jsonify(data), 200)

        except Exception as e :
            print(e)


@files.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Connection"] = "keep-alive"
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Headers', 'GET, POST, PATCH, DELETE, OPTION')
    return response
