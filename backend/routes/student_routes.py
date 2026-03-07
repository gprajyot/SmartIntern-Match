from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from firebase_config import db
from utils.decorators import role_required
from services.resume_analyzer import analyze_resume
from services.firestore_service import store_resume_data
from services.recommendation_service import get_recommendations
from services.email_service import send_email
from datetime import datetime


student_bp = Blueprint("student", __name__)


# =====================================================
# ✅ APPLY FOR INTERNSHIP
# =====================================================
@student_bp.route("/apply/<internship_id>", methods=["POST"])
@jwt_required()
@role_required("student")
def apply_internship(internship_id):

    user_email = get_jwt_identity()

    # 🔍 Check internship exists
    internship_doc = db.collection("internships").document(internship_id).get()

    if not internship_doc.exists:
        return jsonify({"error": "Internship not found"}), 404

    internship_data = internship_doc.to_dict()

    # ❌ Prevent applying to rejected internship
    if internship_data.get("status") == "rejected":
        return jsonify({"error": "Cannot apply to rejected internship"}), 400

    # ❌ Prevent duplicate application
    existing_application = db.collection("applications") \
        .where("student_email", "==", user_email) \
        .where("internship_id", "==", internship_id) \
        .get()

    if existing_application:
        return jsonify({"error": "You have already applied to this internship"}), 400

    application_data = {
        "student_email": user_email,
        "internship_id": internship_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }

    db.collection("applications").add(application_data)

    internship_title = internship_data.get("title")
    company_email = internship_data.get("created_by")

    # 📧 Email to Student
    send_email(
        to_email=user_email,
        subject="Application Submitted Successfully",
        message=f"You have successfully applied for internship '{internship_title}'. We will notify you once reviewed."
    )

    # 📧 Email to Company
    if company_email:
        send_email(
            to_email=company_email,
            subject="📩 New Internship Application",
            message=f"A student ({user_email}) has applied for your internship '{internship_title}'. Please review the application."
        )

    return jsonify({
        "message": "Application submitted successfully"
    }), 201


# =====================================================
# ✅ GET RECOMMENDATIONS
# =====================================================
@student_bp.route("/recommendations", methods=["GET"])
@jwt_required()
@role_required("student")
def recommendations():

    user_email = get_jwt_identity()

    student_doc = db.collection("users") \
        .where("email", "==", user_email) \
        .get()

    if not student_doc:
        return jsonify({"error": "Student not found"}), 404

    student_data = student_doc[0].to_dict()

    student_skills = student_data.get("skills", [])
    student_location = student_data.get("location")
    student_industry = student_data.get("preferred_industry")

    filter_location = request.args.get("location")
    filter_industry = request.args.get("industry")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    results = get_recommendations(
        student_skills=student_skills,
        student_location=student_location,
        student_industry=student_industry,
        filter_location=filter_location,
        filter_industry=filter_industry,
        page=page,
        limit=limit
    )

    return jsonify(results), 200


# =====================================================
# ✅ UPLOAD RESUME
# =====================================================
@student_bp.route("/upload-resume", methods=["POST"])
@jwt_required()
@role_required("student")
def upload_resume():

    user_email = get_jwt_identity()

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    result = analyze_resume(file)

    # Store extracted data
    store_resume_data(user_email, result)

    # 🔥 NEW: AUTO RECOMMEND BASED ON RESUME
    recommendations = get_recommendations(
        student_skills=result.get("skills", []),
        student_experience=result.get("experience", 0),
        resume_score=result.get("score", 0),
        page=1,
        limit=5
    )

    return jsonify({
        "message": "Resume analyzed successfully",
        "resume_data": result,
        "recommended_internships": recommendations["recommendations"]
    }), 200


# =====================================================
# ✅ QUICK TOP 5 RECOMMENDATION
# =====================================================
@student_bp.route("/recommend-internships", methods=["POST"])
@jwt_required()
@role_required("student")
def recommend_internships():

    data = request.get_json()
    student_skills = data.get("skills", [])

    if not student_skills:
        return jsonify({"error": "No skills provided"}), 400

    recommendations = get_recommendations(
        student_skills=student_skills,
        page=1,
        limit=5
    )

    return jsonify({
        "message": "Top 5 internships ranked successfully",
        "recommendations": recommendations.get("recommendations", [])
    }), 200


# =====================================================
# ✅ VIEW MY APPLICATIONS
# =====================================================
@student_bp.route("/applications", methods=["GET"])
@jwt_required()
@role_required("student")
def view_my_applications():

    user_email = get_jwt_identity()

    apps = db.collection("applications") \
        .where("student_email", "==", user_email) \
        .stream()

    result = []

    for app in apps:
        app_data = app.to_dict()

        internship_doc = db.collection("internships") \
            .document(app_data["internship_id"]) \
            .get()

        internship_data = internship_doc.to_dict() if internship_doc.exists else {}

        result.append({
            "application_id": app.id,
            "status": app_data.get("status"),
            "applied_at": app_data.get("created_at"),
            "internship": {
                "id": app_data.get("internship_id"),
                "title": internship_data.get("title"),
                "location": internship_data.get("location"),
                "stipend": internship_data.get("stipend"),
            }
        })

    return jsonify({
        "total_applications": len(result),
        "applications": result
    }), 200