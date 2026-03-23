"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Character, Planet
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

# so I am able to delete, post, and get all from our html interface, and see those once I use a 'GET' method on postman, BUT
# I am not able to delete or post from postman, I get a 404 error.
#I am also not able to see the favorites when I use the 'GET' method on postman.


@api.route('/people', methods=['GET'])
def get_all_people():
    # variable all_people is a list of OBJECTS.
    all_people = db.session.execute(select(Character)).scalars().all()
    # open array which will be where the objects are stored as DICTIONARIES.
    list_of_dictionaries = []
    for person in all_people:  # each person in the list as we iterate through is an OBJECT
        list_of_dictionaries.append(person.serialize())
        # Now there is a list of dictionaries stored in the variable 'list_of_dictionaries'
    return jsonify(list_of_dictionaries), 200
        # now we jsonify the list of dictionaries so it can be sent (to the front end??)


@api.route('/people/<int:people_id>', methods=['GET'])
def get_one_person(people_id):
    found_person = db.session.get(Character, people_id)
    if found_person is None:
        return jsonify({"msg: Character does not exist"}), 404
    return jsonify(found_person.serialize()), 200


@api.route('/planets', methods=['GET'])
def get_all_planets():
    all_planets = db.session.execute(select(Planet)).scalars().all()
    list_of_dictionaries = []
    for planet in all_planets:
        list_of_dictionaries.append(planet.serialize())
    return jsonify(list_of_dictionaries), 200
    

@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_one_planet(planet_id):
    found_planet = db.session.get(Planet, planet_id)
    if found_planet is None:
        return jsonify({"msg: Planet does not exist"}), 404
    return jsonify(found_planet.serialize()), 200


@api.route('/users', methods=['GET'])
def get_all_users():
    all_users = db.session.execute(select(User)).scalars().all()
    list_of_dictionaries = []
    for user in all_users:
        list_of_dictionaries.append(user.serialize())
    return jsonify(list_of_dictionaries), 200

@api.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    found_user = db.session.get(User, user_id)
    if found_user is None:
        return jsonify({"msg: User does not exist"}), 404
    serialized_user = found_user.serialize()
    return jsonify({
        "user_id": serialized_user["id"],
        "favorite_characters": serialized_user["favorite_characters"],
        "favorite_planets": serialized_user["favorite_planets"],
    })


@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
def new_favorite_planet(planet_id):
    body = request.json
    found_user = db.session.get(User, body["user_id"])
    new_fav_planet = db.session.get(Planet, planet_id)
    if found_user is None or new_fav_planet is None:
        return jsonify({"msg: Planet or User was not found"}), 404
    found_user.favorite_planets.append(new_fav_planet)
    db.session.commit()
    serialized_user = found_user.serialize()
    return jsonify({"favorite_planets": serialized_user["favorite_planets"]}), 200

#when using postman dont forget the /api before our endpoints (paths above on routes)

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
def new_favorite_person(people_id):
    body = request.json
    found_user = db.session.get(User, body["user_id"])
    new_fav_char = db.session.get(Character, people_id)
    if found_user is None or new_fav_char is None:
        return jsonify({"msg: Charcter or User was not found"}), 404
    found_user.favorite_characters.append(new_fav_char)
    db.session.commit()
    serialized_user = found_user.serialize()
    return jsonify({"favorite_characters": serialized_user["favorite_characters"]}), 200


@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
def delete_favorite_person(people_id):
    body = request.json
    found_user = db.session.get(User, body["user_id"])
    del_fav_char = db.session.get(Character, people_id)
    if found_user is None or del_fav_char is None:
        return jsonify({"msg: Charcter or User was not found"}), 404
    found_user.favorite_characters.remove(del_fav_char)
    db.session.commit()
    serialized_user = found_user.serialize()
    return jsonify({"favorite_characters": serialized_user["favorite_characters"]}), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
def delete_favorite_planet(planet_id):
    body = request.json
    found_user = db.session.get(User, body["user_id"])
    del_fav_plan = db.session.get(Planet, planet_id)
    if found_user is None or del_fav_plan is None:
        return jsonify({"msg: Planet or User was not found"}), 404
    found_user.favorite_planets.remove(del_fav_plan)
    db.session.commit()
    serialized_user = found_user.serialize()
    return jsonify({"favorite_planets": serialized_user["favorite_planets"]}), 200

