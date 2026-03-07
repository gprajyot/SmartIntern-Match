from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from firebase_config import db
from utils.decorators import role_required

internship_bp = Blueprint("internship", __name__)


# ✅ Create Internship (Company Only)
@internship_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("company")
def create_internship():
    data = request.get_json()

    internship_data = {
        "title": data.get("title"),
        "description": data.get("description"),
        "location": data.get("location"),
        "duration": data.get("duration"),
        "stipend": data.get("stipend"),
        "industry": data.get("industry"),
        "created_by": get_jwt_identity()
    }

    db.collection("internships").add(internship_data)

    return {"message": "Internship created successfully"}, 201


# ✅ Get All Internships (Public)
@internship_bp.route("/", methods=["GET"])
def get_internships():
    docs = db.collection("internships").stream()

    internships = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        internships.append(data)

    return jsonify(internships)