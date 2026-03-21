"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/people', methods=['GET'])
def get_all_people():
    pass

@api.route('/people/<int:people_id>', methods=['GET'])
def get_one_person():
    pass

@api.route('/planets', methods=['GET'])
def get_all_planets():
    pass

@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_one_planet():
    pass

@api.route('/users', methods=['GET'])
def get_all_users():
    pass

@api.route('/users/favorites>', methods=['GET'])
def get_user_favorites():
    pass

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
def new_favorite_planet():
    pass

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
def new_favorite_person():
    pass

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
def delete_favorite_person():
    pass

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
def delete_favorite_planet():
    pass

