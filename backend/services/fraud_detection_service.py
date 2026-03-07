from services.ml_fraud_model import predict_fraud

SUSPICIOUS_KEYWORDS = [
    "earn money fast",
    "no interview",
    "work from home and earn",
    "pay registration fee",
    "limited seats hurry",
    "guaranteed job"
]


def calculate_fraud_score(internship):

    risk_score = 0

    description = str(internship.get("description", "")).lower()
    title = str(internship.get("title", "")).lower()
    full_text = f"{title} {description}"

    # =====================================================
    # 🚨 1️⃣ Keyword-Based Rule Detection
    # =====================================================
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in full_text:
            risk_score += 2

    # =====================================================
    # 🚨 2️⃣ Stipend / Salary Check (SAFE)
    # =====================================================
    stipend = internship.get("stipend") or internship.get("salary")

    try:
        if stipend and int(stipend) > 100000:
            risk_score += 2
    except (ValueError, TypeError):
        pass

    # =====================================================
    # 🚨 3️⃣ Missing Company Info (SAFE)
    # =====================================================
    if not internship.get("created_by"):
        risk_score += 1

    # =====================================================
    # 🚨 4️⃣ Source Check (SAFE)
    # =====================================================
    source = internship.get("source")

    if source and source not in ["internal", "adzuna"]:
        risk_score += 1

    # =====================================================
    # 🤖 5️⃣ ML Model Fraud Prediction (SAFE)
    # =====================================================
    try:
        prediction, probability = predict_fraud(full_text)

        if prediction == 1:
            risk_score += 2

        if probability and probability > 0.80:
            risk_score += 1

    except Exception:
        # Never crash system if ML fails
        pass

    return risk_score