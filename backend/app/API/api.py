from flask import (Blueprint, session)
from flask import request, jsonify, make_response
from flask_projects.bloggy.app.database.model import *
from flask_projects.bloggy.app.API.text_summarization import article_summary
import time as t
from werkzeug.exceptions import HTTPException

article = Blueprint('article', __name__)


@article.route("/user", methods=["POST"])
def home():
    """
    Get username from local storge,
    and store it in session
    :return:
    """
    response = {
        "success": False
    }
    try:
        if request.method == "POST":
            post_data = request.get_json()
            if post_data is None or post_data.get('username') == "":
                session["user"] = ""
                return jsonify(response), 400
            else:
                session["user"] = f"{post_data.get('username')}"
                response["success"] = True
                return jsonify(response), 200
    except Exception as e:
        print(e)


@article.route("/topics", methods=["GET"])
def get_topic():
    """
    Send topics, sorted by topics related to user interested
    :return:
    """
    try:
        current_username = session.get("user")
        users = [user.user_name for user in User.query.all()]
        if current_username is None or current_username not in users:
            topics = list()
            interested = Interest.query.all()
            for interest in interested:
                topics.append(interest.topic)
            return make_response(jsonify({
                "topics": topics
            }), 200)

        elif current_username is not None or current_username in users:
            current_userid = User.query.filter_by(user_name=current_username).first()
            interested_mange = InterestedManagement.query.filter_by(user_id=current_userid.user_id).all()
            topics = list()
            for interested in interested_mange:
                interest = Interest.query.get(interested.interest_id)
                topics.append(interest.topic)
            return make_response(jsonify({
                "topics": topics
            }), 200)

    except Exception as e:
        print(e)


@article.route("/article", methods=["POST", "GET"])
def show_article():
    """
    Send all articles
    :return:
    """
    try:
        article_list = list()
        articles_query = Article.query.all()
        for article in articles_query:
            interested_query = Interest.query.get(article.interested_id)

            article_list.append(
                {
                    "article_id": article.article_id,
                    "title": article.title,
                    "content": article.content,
                    "image": article.image_url,
                    "auther": article.auther,
                    "time": article.time,
                    "topic": interested_query.topic
                }
            )
        return make_response(jsonify({"articles": article_list}), 200)
    except Exception as e:
        print(e)


@article.route("/article/<int:article_id>", methods=["POST", "GET"])
def articles(article_id):
    """
    Send single article
    :param article_id:
    :return:
    """
    try:
        article = Article.query.get(article_id)
        current_username = session.get("user")
        user = User.query.filter_by(user_name=current_username).first()

        if user.full_name == article.auther:
            return make_response(
                jsonify(
                    {
                        "article_id": article.article_id,
                        "title": article.title,
                        "content": article.content,
                        "image": article.image_url,
                        "auther": article.auther,
                        "time": article.time,
                        "username": user.user_name
                    }
                ), 200
            )
        else:
            return make_response(
                jsonify(
                    {
                        "article_id": article.article_id,
                        "title": article.title,
                        "content": article.content,
                        "image": article.image_url,
                        "auther": article.auther,
                        "time": article.time,
                        "username": ""
                    }
                ), 200)
    except Exception as e:
        print(e)


@article.route("/article/search", methods=["POST", "GET"])
def search_article():
    """
    Send articles, after get search term
    :return:
    """
    try:
        data = []
        if request.method == "POST" or request.method == "GET":
            search = request.get_json()
            if search == "":
                return make_response(jsonify({"articles": []}), 200)

            else:
                article_search = Article.query.filter(Article.content.ilike(f'%{search.get("search")}%')).all()
                for search in article_search:
                    data.append({
                        "article_id": search.article_id,
                        "title": search.title,
                    })
                return make_response(jsonify({"articles": data}), 200)

    except Exception as e:
        print(e)


@article.route("/article/summery", methods=["GET"])
def article_sentences():
    """
    Text Summarization,
    send summery of articles
    :return:
    """
    try:
        article_list = list()
        articles_query = Article.query.all()
        for article in articles_query:
            interested_query = Interest.query.get(article.interested_id)
            article_list.append(
                {
                    "article_id": article.article_id,
                    "title": article.title,
                    "content": article_summary(article.content),
                    "topic": interested_query.topic,
                    "image": article.image_url,
                    "auther": article.auther,
                    "time": article.time
                }

            )
        return make_response(jsonify({"articles": article_list}), 200)
    except Exception as e:
        print(e)


@article.route("/article/write", methods=["POST", "GET"])
def create_article():
    """
    Write a new article
    :return:
    """
    t.sleep(4)
    try:
        response = {
            "success": False,
            "message": "Not added"
        }
        if request.method == "POST":
            new_article = request.get_json()
            title = new_article.get("title")
            content = new_article.get("content")
            topic = new_article.get("topic")
            time = new_article.get("time")
            username = new_article.get("auther")
            topic_list = [inter.topic for inter in Interest.query.all()]
            user = User.query.filter_by(user_name=username).first()
            auther = user.full_name
            t.sleep(3)
            global image_path
            if auther is None or auther == "":
                response["settings"] = False
                return make_response(response, 200)
            if title == "" or content == "" or topic == "" or auther is None or auther == "":
                return make_response(response, 422)

            else:
                if session.get("filepath") is not None or session.get("filepath") == "":
                    image_path = "http://" + request.host + (session.get("filepath"))
                else:
                    image_path = ""
                if topic in topic_list:
                    intrested_id = (Interest.query.filter_by(topic=topic).first())
                    article_new = Article(title=title, content=content, interested_id=intrested_id.interest_id,
                                          time=time, image_url=image_path, auther=auther)
                    article_new.insert()
                    response["success"] = True
                    response["message"] = 'Successfully added'
                    response["article_id"] = article_new.article_id
                    session["filepath"] = ""

                    return make_response(response, 200)
                else:
                    new_topic = Interest(topic=topic, description="")
                    new_topic.insert()
                    article_new = Article(title=title, content=content, interested_id=new_topic.interest_id, time=time,
                                          image_url=image_path, auther=auther)
                    article_new.insert()
                    response["success"] = True
                    response["message"] = 'Successfully added article and topic'
                    response["article_id"] = article_new.article_id
                    session["filepath"] = ""
                    return make_response(response, 200)
    except BaseException as e:
        print(e)


@article.route("/article/<int:article_id>/update", methods=["POST", "GET"])
def update_article(article_id):
    """
    Update article
    change the content and title of article
    if user owen this
    :param article_id:
    :return:
    """
    try:
        response = {
            "success": False,
            "message": "Not Updated"
        }
        update_data = request.get_json()
        title = update_data.get("title")
        content = update_data.get("content")
        article_update = Article.query.filter_by(article_id=article_id).first()
        if title != "":
            article_update.title = title
            article_update.update()
        if content != "":
            article_update.content = content
            article_update.update()
        response["success"] = True
        response["message"] = "Article Updated"
        return make_response(response, 200)

    except BaseException as e:
        print(e)


@article.route("/article/<int:article_id>/delete", methods=["DELETE"])
def delete_article(article_id):
    """
    Delete article, if user owen this
    :param article_id:
    :return:
    """
    response = {
        "success": False,
        "message": "Not Delete"
    }
    try:
        article_delete = Article.query.filter_by(article_id=article_id).first()
        article_delete.delete()
        response["success"] = True
        response["message"] = "Delete Article"
        return make_response(jsonify(response), 200)
    except Exception as e:
        print(e)


@article.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Connection"] = "keep-alive"
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Headers', 'GET, POST, PATCH, DELETE, OPTION')
    return response


@article.errorhandler(HTTPException)
def handle_error(error: HTTPException):
    response = error.get_response()
    response.data = {
        "code": error.code,
        "name": error.name,
        "description": error.description,
    }
    response.content_type = "application/json"
    return make_response(response), response.status_code
