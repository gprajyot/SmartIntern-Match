from services.recommendation_service import get_top_5_recommendations
from firebase_config import db


def detect_intent(message):

    message = message.lower()

    if "recommend" in message or "internship" in message:
        return "recommend"

    if "status" in message or "application" in message:
        return "application_status"

    if "fraud" in message or "fake" in message:
        return "fraud_info"

    if "resume" in message:
        return "resume_help"

    return "general"


def chatbot_reply(user_email, message):

    intent = detect_intent(message)

    # ===============================
    # 1️⃣ RECOMMENDATION INTENT
    # ===============================
    if intent == "recommend":

        resume_doc = db.collection("resumes").document(user_email).get()

        if not resume_doc.exists:
            return "Please upload your resume first so I can recommend internships."

        resume_data = resume_doc.to_dict()
        skills = resume_data.get("skills_found", [])

        recommendations = get_top_5_recommendations(skills)

        if not recommendations["recommendations"]:
            return "No internships found matching your skills."

        response = "Here are top internships for you:\n\n"

        for item in recommendations["recommendations"]:
            response += f"- {item.get('title')} (Match: {item.get('match_score')}%)\n"

        return response

    # ===============================
    # 2️⃣ APPLICATION STATUS
    # ===============================
    if intent == "application_status":

        applications = db.collection("applications") \
            .where("student_email", "==", user_email) \
            .stream()

        results = list(applications)

        if not results:
            return "You have not applied to any internships yet."

        response = "Your application statuses:\n\n"

        for app in results:
            data = app.to_dict()
            response += f"- Internship ID: {data.get('internship_id')} → {data.get('status')}\n"

        return response

    # ===============================
    # 3️⃣ FRAUD INFO
    # ===============================
    if intent == "fraud_info":
        return "Our system automatically detects fake internships using AI and fraud detection models."

    # ===============================
    # 4️⃣ RESUME HELP
    # ===============================
    if intent == "resume_help":
        return "Improve your resume by adding more technical skills and project experience."

    # ===============================
    # DEFAULT RESPONSE
    # ===============================
    return "I am your AI Internship Assistant. Ask me about internships, applications, or resume tips."