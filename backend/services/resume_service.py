import PyPDF2

SKILL_KEYWORDS = [
    "python", "java", "flask", "django",
    "machine learning", "data analysis",
    "sql", "firebase", "react",
    "html", "css", "javascript"
]


def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.lower()


def extract_skills(text):
    extracted = []

    for skill in SKILL_KEYWORDS:
        if skill in text:
            extracted.append(skill)

    return extracted