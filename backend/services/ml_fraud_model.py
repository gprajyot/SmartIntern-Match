import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Dummy training dataset
texts = [
    "earn money fast no interview",
    "pay registration fee",
    "software development internship python",
    "backend internship flask"
]

labels = [1, 1, 0, 0]  # 1 = fraud, 0 = genuine

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)


def predict_fraud(text):
    vec = vectorizer.transform([text])
    prediction = model.predict(vec)[0]
    probability = model.predict_proba(vec)[0][1]

    return prediction, probability