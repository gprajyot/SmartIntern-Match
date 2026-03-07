import pdfplumber
import re

SKILL_KEYWORDS = [
    "python", "java", "flask", "react",
    "machine learning", "sql", "firebase",
    "html", "css", "javascript"
]

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
    return text.lower()


# ---------------- SKILL EXTRACTION ----------------
def extract_skills(text):
    skills_found = []
    for skill in SKILL_KEYWORDS:
        if skill in text:
            skills_found.append(skill)
    return skills_found


# ---------------- EXPERIENCE EXTRACTION ----------------
def extract_experience(text):
    pattern = r'(\d+)\s+years?'
    matches = re.findall(pattern, text)

    if matches:
        return max([int(x) for x in matches])
    return 0


# ---------------- EDUCATION EXTRACTION ----------------
def extract_education(text):
    education_levels = []

    if "bsc" in text or "bachelor" in text:
        education_levels.append("Bachelor Degree")

    if "msc" in text or "master" in text:
        education_levels.append("Master Degree")

    if "hsc" in text:
        education_levels.append("HSC")

    return education_levels


# ---------------- RESUME SCORE ----------------
def calculate_resume_score(skills, experience):
    skill_score = len(skills) * 8        # each skill = 8 marks
    experience_score = experience * 5    # per year = 5 marks

    total_score = skill_score + experience_score

    if total_score > 100:
        total_score = 100

    return total_score


# ---------------- MAIN ANALYZER ----------------
def analyze_resume(file):
    text = extract_text_from_pdf(file)

    skills = extract_skills(text)
    experience = extract_experience(text)
    education = extract_education(text)

    score = calculate_resume_score(skills, experience)

    return {
        "skills_found": skills,
        "experience_years": experience,
        "education": education,
        "resume_score": score
    }