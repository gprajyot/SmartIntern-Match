from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, index=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="student")
    education = db.Column(db.String(200))
    skills = db.Column(db.Text)
    interests = db.Column(db.String(200))
    location = db.Column(db.String(100))
    resume_url = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship("Application", backref="student", cascade="all, delete")
    saved_internships = db.relationship(
    "SavedInternship",
    backref="student",
    cascade="all, delete",
    lazy=True
)