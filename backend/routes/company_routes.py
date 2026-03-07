from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from firebase_config import db
from utils.decorators import role_required
from collections import defaultdict
from services.email_service import send_email
from services.fraud_detection_service import calculate_fraud_score  # ✅ IMPORTANT

company_bp = Blueprint("company", __name__)

# =====================================================
# ✅ CREATE INTERNSHIP
# =====================================================
@company_bp.route("/create-internship", methods=["POST"])
@jwt_required()
@role_required("company")
def create_internship():

    company_email = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid data"}), 400

    internship_data = {
        "title": data.get("title"),
        "description": data.get("description"),
        "location": data.get("location"),
        "stipend": data.get("stipend"),
        "industry": data.get("industry"),
        "required_experience": int(data.get("required_experience", 0)),
        "created_by": company_email,
        "source": "internal",
        "status": "active"
    }

    # 🔥 FRAUD CHECK
    fraud_score = calculate_fraud_score(internship_data)
    internship_data["fraud_score"] = fraud_score

    if fraud_score >= 5:
        internship_data["status"] = "under_review"

    db.collection("internships").add(internship_data)

    return jsonify({
        "message": "Internship created successfully",
        "fraud_score": fraud_score
    }), 201


# =====================================================
# ✅ VIEW APPLICANTS
# =====================================================
@company_bp.route("/applicants/<internship_id>", methods=["GET"])
@jwt_required()
@role_required("company")
def view_applicants(internship_id):

    company_email = get_jwt_identity()

    internship_doc = db.collection("internships").document(internship_id).get()

    if not internship_doc.exists:
        return jsonify({"error": "Internship not found"}), 404

    internship_data = internship_doc.to_dict()

    if internship_data.get("created_by") != company_email:
        return jsonify({"error": "Not authorized"}), 403

    applications = db.collection("applications") \
        .where("internship_id", "==", internship_id) \
        .stream()

    result = []

    for app in applications:
        app_data = app.to_dict()

        result.append({
            "application_id": app.id,
            "student_email": app_data.get("student_email"),
            "status": app_data.get("status"),
            "applied_at": app_data.get("created_at")
        })

    return jsonify({
        "total_applicants": len(result),
        "applicants": result
    }), 200


# =====================================================
# ✅ COMPANY ANALYTICS
# =====================================================
@company_bp.route("/analytics", methods=["GET"])
@jwt_required()
@role_required("company")
def company_analytics():

    company_email = get_jwt_identity()

    internships = db.collection("internships") \
        .where("created_by", "==", company_email) \
        .stream()

    internship_ids = []
    total_internships = 0
    under_review_count = 0
    rejected_count = 0

    for internship in internships:
        data = internship.to_dict()
        internship_ids.append(internship.id)
        total_internships += 1

        if data.get("status") == "under_review":
            under_review_count += 1

        if data.get("status") == "rejected":
            rejected_count += 1

    total_applications = 0
    status_distribution = defaultdict(int)

    for internship_id in internship_ids:
        apps = db.collection("applications") \
            .where("internship_id", "==", internship_id) \
            .stream()

        for app in apps:
            data = app.to_dict()
            total_applications += 1
            status_distribution[data.get("status")] += 1

    return jsonify({
        "total_internships": total_internships,
        "under_review_internships": under_review_count,
        "rejected_internships": rejected_count,
        "total_applications": total_applications,
        "status_distribution": dict(status_distribution)
    }), 200


# =====================================================
# ✅ ACCEPT / REJECT APPLICATION (WITH EMAIL)
# =====================================================
@company_bp.route("/application/<application_id>", methods=["PUT"])
@jwt_required()
@role_required("company")
def update_application_status(application_id):

    company_email = get_jwt_identity()
    data = request.get_json()

    new_status = data.get("status")

    if new_status not in ["accepted", "rejected"]:
        return jsonify({"error": "Status must be 'accepted' or 'rejected'"}), 400

    app_doc = db.collection("applications").document(application_id).get()

    if not app_doc.exists:
        return jsonify({"error": "Application not found"}), 404

    app_data = app_doc.to_dict()

    internship_doc = db.collection("internships") \
        .document(app_data.get("internship_id")) \
        .get()

    if not internship_doc.exists:
        return jsonify({"error": "Internship not found"}), 404

    internship_data = internship_doc.to_dict()

    if internship_data.get("created_by") != company_email:
        return jsonify({"error": "Not authorized"}), 403

    db.collection("applications").document(application_id).update({
        "status": new_status
    })

    # 📧 Email Student
    student_email = app_data.get("student_email")

    if new_status == "accepted":
        subject = "🎉 Application Accepted"
        message = f"Your application for '{internship_data.get('title')}' has been ACCEPTED."
    else:
        subject = "❌ Application Rejected"
        message = f"Your application for '{internship_data.get('title')}' has been REJECTED."

    send_email(student_email, subject, message)

    return jsonify({
        "message": f"Application {new_status} successfully"
    }), 200


# =====================================================
# ✅ GET MY INTERNSHIPS (COMPANY ONLY)
# =====================================================
@company_bp.route("/my-internships", methods=["GET"])
@jwt_required()
@role_required("company")
def get_my_internships():

    company_email = get_jwt_identity()

    internships = db.collection("internships") \
        .where("created_by", "==", company_email) \
        .stream()

    results = []

    for doc in internships:
        data = doc.to_dict()
        data["id"] = doc.id   # VERY IMPORTANT
        results.append(data)

    return jsonify(results), 200