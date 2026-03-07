
from datetime import datetime

class Internship(db.Model):
    __tablename__ = "internships"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100))
    duration = db.Column(db.String(100))
    stipend = db.Column(db.String(50))
    industry = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship(
        "Application",
        backref="internship",
        cascade="all, delete",
        lazy=True
    )

    saved_by = db.relationship(
        "SavedInternship",
        backref="internship",
        cascade="all, delete",
        lazy=True
    )