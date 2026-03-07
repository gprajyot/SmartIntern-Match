import PyPDF2
import spacy

nlp = spacy.load("en_core_web_sm")

# Basic skill keywords list (you can expand)
SKILL_KEYWORDS = [
    "python", "java", "flask", "django", "machine learning",
    "data analysis", "sql", "firebase", "react", "html",
    "css", "javascript", "deep learning", "nlp"
]


def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.lower()


def extract_skills(text):
    extracted_skills = []

    for skill in SKILL_KEYWORDS:
        if skill in text:
            extracted_skills.append(skill)

    return extracted_skills