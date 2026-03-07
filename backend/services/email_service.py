import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email(to_email, subject, message):

    msg = EmailMessage()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    # Plain text fallback
    msg.set_content(message)

    # HTML Version
    msg.add_alternative(f"""
    <html>
        <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
            <div style="background:white; padding:20px; border-radius:8px;">
                <h2 style="color:#2c3e50;">{subject}</h2>
                <p style="font-size:15px;">{message}</p>
                <hr>
                <p style="font-size:12px; color:gray;">
                    AI Internship Recommendation Platform
                </p>
            </div>
        </body>
    </html>
    """, subtype="html")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print("Email sent successfully")
        return True

    except Exception as e:
        print("Email sending failed:", e)
        return False