from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
from firebase_config import db
from services.email_service import send_email
from utils.token_utils import generate_reset_token, verify_reset_token

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


# =====================================================
# ✅ REGISTER
# =====================================================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    users_ref = db.collection("users")

    existing_users = list(users_ref.where("email", "==", email).stream())
    if existing_users:
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    user_data = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "role": role
    }

    users_ref.add(user_data)

    # 📧 Welcome Email
    send_email(
        to_email=email,
        subject="🎉 Welcome to AI Internship Platform",
        message=f"""
Welcome {name}!

You can now:
- Upload your resume
- Get AI-powered recommendations
- Apply to internships
- Track your applications

We are excited to have you onboard!
"""
    )

    return jsonify({"message": "User registered successfully"}), 201


# =====================================================
# ✅ LOGIN
# =====================================================
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    users = list(db.collection("users")
                 .where("email", "==", email)
                 .stream())

    if not users:
        return jsonify({"error": "User not found"}), 404

    user_doc = users[0]
    user = user_doc.to_dict()

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=user["email"],
        additional_claims={"role": user["role"]}
    )

    return jsonify({"access_token": token}), 200


# =====================================================
# ✅ FORGOT PASSWORD
# =====================================================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    users = list(db.collection("users")
                 .where("email", "==", email)
                 .stream())

    if not users:
        return jsonify({"error": "User not found"}), 404

    token = generate_reset_token(email)

    reset_link = f"http://127.0.0.1:5000/api/auth/reset-password/{token}"

    send_email(
        to_email=email,
        subject="🔐 Password Reset Request",
        message=f"""
Click below to reset your password:

{reset_link}

This link expires in 1 hour.
"""
    )

    return jsonify({"message": "Password reset email sent"}), 200


# =====================================================
# ✅ RESET PASSWORD
# =====================================================
@auth_bp.route("/reset-password/<path:token>", methods=["POST"])
def reset_password(token):

    email = verify_reset_token(token)

    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    data = request.get_json()
    new_password = data.get("password")

    if not new_password:
        return jsonify({"error": "Password required"}), 400

    hashed_pw = bcrypt.generate_password_hash(new_password).decode("utf-8")

    users = list(db.collection("users")
                 .where("email", "==", email)
                 .stream())

    if not users:
        return jsonify({"error": "User not found"}), 404

    user_doc = users[0]

    db.collection("users").document(user_doc.id).update({
        "password": hashed_pw
    })

    return jsonify({"message": "Password updated successfully"}), 200