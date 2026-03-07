from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"reply": "Please type something."}), 400

    user_message = data["message"].lower()

    # Simple AI Logic
    if "hi" in user_message:
        reply = "Hello 👋 How can I help you with internships?"
    elif "recommend" in user_message:
        reply = "You can check your dashboard for personalized recommendations."
    elif "internship" in user_message:
        reply = "We provide AI-based internship matching based on your skills."
    else:
        reply = "I'm here to help you with internships, resumes, and applications."

    return jsonify({"reply": reply}), 200