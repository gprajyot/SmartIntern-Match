import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


# ---------------- STORE OR UPDATE RESUME ----------------
def store_resume_data(user_id, resume_data):

    resume_data["updated_at"] = datetime.utcnow()

    db.collection("resumes").document(user_id).set(
        resume_data,
        merge=True  # This prevents overwriting entire document
    )

    return True


# ---------------- GET RESUME DATA ----------------
def get_resume_data(user_id):

    doc = db.collection("resumes").document(user_id).get()

    if doc.exists:
        return doc.to_dict()

    return None


# ---------------- STORE INTERNSHIP ----------------
def store_internship(internship_data):

    internship_data["created_at"] = datetime.utcnow()

    doc_ref = db.collection("internships").add(internship_data)

    return doc_ref[1].id  # return document id


# ---------------- GET ALL INTERNSHIPS ----------------
def get_all_internships():

    internships = []
    docs = db.collection("internships").stream()

    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        internships.append(data)

    return internships


# ---------------- STORE MATCH SCORE ----------------
def store_match_score(user_id, internship_id, score):

    db.collection("match_scores").add({
        "user_id": user_id,
        "internship_id": internship_id,
        "match_score": score,
        "calculated_at": datetime.utcnow()
    })

    return True