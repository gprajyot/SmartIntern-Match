from firebase_config import db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.fraud_detection_service import calculate_fraud_score


def get_recommendations(
    student_skills,
    student_location=None,
    student_industry=None,
    student_experience=0,
    resume_score=0,
    filter_location=None,
    filter_industry=None,
    page=1,
    limit=10,
    top_5=False
):

    internships = list(db.collection("internships").stream())

    internship_texts = []
    internship_data_list = []

    # ✅ Convert skills safely
    if isinstance(student_skills, list):
        student_text = " ".join(student_skills)
    else:
        student_text = str(student_skills or "")

    # =====================================================
    # 🔍 FILTER BEFORE MATCHING
    # =====================================================
    for doc in internships:
        data = doc.to_dict()
        data["id"] = doc.id

        # ❌ Skip rejected internships
        if data.get("status") == "rejected":
            continue

        # ⚠ Skip under_review for students
        if data.get("status") == "under_review":
            continue

        if filter_location:
            if not data.get("location") or filter_location.lower() not in data.get("location", "").lower():
                continue

        if filter_industry:
            if not data.get("industry") or filter_industry.lower() not in data.get("industry", "").lower():
                continue

        title = data.get("title") or ""
        description = data.get("description") or ""

        internship_data_list.append(data)
        internship_texts.append(f"{title} {description}")

    if not internship_texts:
        return {
            "total_results": 0,
            "recommendations": []
        }

    # =====================================================
    # 🔥 TF-IDF Matching
    # =====================================================
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([student_text] + internship_texts)
    similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    ranked = []

    # =====================================================
    # 🎯 SCORING LOGIC
    # =====================================================
    for i, internship in enumerate(internship_data_list):

        base_score = similarity_scores[i]

        # 🎯 Location Boost
        if student_location and internship.get("location"):
            if student_location.lower() in internship["location"].lower():
                base_score += 0.10

        # 🎯 Industry Boost
        if student_industry and internship.get("industry"):
            if student_industry.lower() in internship["industry"].lower():
                base_score += 0.08

        # 🎯 Experience Boost
        required_exp = internship.get("required_experience", 0) or 0
        if student_experience >= required_exp:
            base_score += 0.07

        # 🎯 Resume Score Boost
        if resume_score >= 70:
            base_score += 0.05

        # 🎯 Internal Source Boost
        if internship.get("source") != "adzuna":
            base_score += 0.03

        # =====================================================
        # 🚨 FRAUD DETECTION
        # =====================================================
        fraud_score = calculate_fraud_score(internship)

        # Hard block very risky
        if fraud_score >= 5:
            continue

        # Apply penalty
        base_score -= fraud_score * 0.05

        # Normalize
        final_score = max(min(base_score, 1.0), 0)

        ranked.append((internship, final_score, fraud_score))

    # =====================================================
    # 🔥 SORTING
    # =====================================================
    ranked.sort(key=lambda x: x[1], reverse=True)

    # Top 5 Mode
    if top_5:
        ranked = ranked[:5]

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = ranked[start:end]

    results = []

    for internship, score, fraud_score in paginated:
        internship["match_score"] = round(score * 100, 2)
        internship["fraud_risk"] = fraud_score

        # Add visual warning flag
        if fraud_score >= 3:
            internship["warning"] = "⚠ Under Review"

        results.append(internship)

    return {
        "total_results": len(ranked),
        "page": page,
        "limit": limit,
        "recommendations": results
    }


def get_top_5_recommendations(student_skills):
    return get_recommendations(
        student_skills=student_skills,
        page=1,
        limit=5,
        top_5=True
    )