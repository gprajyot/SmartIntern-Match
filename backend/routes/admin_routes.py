from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from firebase_config import db
from utils.decorators import role_required
from collections import defaultdict
from datetime import datetime
from services.external_internship_service import fetch_adzuna_internships


admin_bp = Blueprint("admin", __name__)


# ============================================
# ✅ TEST ADZUNA API
# ============================================
@admin_bp.route("/test-adzuna", methods=["GET"])
@jwt_required()
@role_required("admin")
def test_adzuna():

    data = fetch_adzuna_internships()

    return jsonify({
        "count": len(data),
        "sample_data": data[:2]
    }), 200


# ============================================
# ✅ ADMIN STATS
# ============================================
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_stats():

    users = list(db.collection("users").stream())
    internships = list(db.collection("internships").stream())
    applications = list(db.collection("applications").stream())

    total_students = 0
    total_companies = 0

    for user in users:
        role = user.to_dict().get("role")

        if role == "student":
            total_students += 1
        elif role == "company":
            total_companies += 1

    return jsonify({
        "total_users": len(users),
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": len(internships),
        "total_applications": len(applications)
    }), 200


# ============================================
# ✅ DELETE USER
# ============================================
@admin_bp.route("/user/<user_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_user(user_id):

    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"error": "User not found"}), 404

    user_ref.delete()

    return jsonify({"message": "User deleted successfully"}), 200


# ============================================
# ✅ DELETE INTERNSHIP
# ============================================
@admin_bp.route("/internship/<internship_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_internship(internship_id):

    internship_ref = db.collection("internships").document(internship_id)
    internship_doc = internship_ref.get()

    if not internship_doc.exists:
        return jsonify({"error": "Internship not found"}), 404

    internship_ref.delete()

    return jsonify({"message": "Internship deleted successfully"}), 200


# ============================================
# ✅ FRAUD INTERNSHIPS
# ============================================
@admin_bp.route("/fraud-internships", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_fraud_internships():

    internships = db.collection("internships") \
        .where("status", "in", ["under_review", "rejected"]) \
        .stream()

    results = []

    for doc in internships:
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)

    return jsonify({
        "total": len(results),
        "fraud_cases": results
    }), 200


# ============================================
# ✅ DASHBOARD ANALYTICS
# ============================================
@admin_bp.route("/analytics", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_analytics():

    users = list(db.collection("users").stream())
    internships = list(db.collection("internships").stream())
    applications = list(db.collection("applications").stream())

    # 📊 Role Distribution
    role_distribution = {
        "student": 0,
        "company": 0,
        "admin": 0
    }

    for user in users:
        role = user.to_dict().get("role")
        if role in role_distribution:
            role_distribution[role] += 1

    # 📊 Applications Per Month
    monthly_applications = defaultdict(int)

    for app in applications:
        created_at = app.to_dict().get("created_at")

        if created_at:
            try:
                date_obj = datetime.fromisoformat(created_at)
                month_key = date_obj.strftime("%Y-%m")
                monthly_applications[month_key] += 1
            except Exception:
                continue

    # 📊 Industry Distribution
    industry_distribution = defaultdict(int)

    for internship in internships:
        industry = internship.to_dict().get("industry")
        if industry:
            industry_distribution[industry] += 1

    # 📊 Location Distribution
    location_distribution = defaultdict(int)

    for internship in internships:
        location = internship.to_dict().get("location")
        if location:
            location_distribution[location] += 1

    return jsonify({
        "role_distribution": role_distribution,
        "monthly_applications": dict(monthly_applications),
        "industry_distribution": dict(industry_distribution),
        "location_distribution": dict(location_distribution),
        "total_users": len(users),
        "total_internships": len(internships),
        "total_applications": len(applications)
    }), 200