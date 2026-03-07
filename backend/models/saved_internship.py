

class SavedInternship(db.Model):
    __tablename__ = "saved_internships"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    internship_id = db.Column(
        db.Integer,
        db.ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False
    )