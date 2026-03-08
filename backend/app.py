from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

from services.scheduler_service import start_scheduler
from routes.auth_routes import auth_bp
from routes.internship_routes import internship_bp
from routes.student_routes import student_bp
from routes.company_routes import company_bp
from routes.admin_routes import admin_bp
from routes.chatbot_routes import chatbot_bp


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


def create_app():
    app = Flask(__name__)

    # Load secret key
    secret_key = os.getenv("SECRET_KEY")

    if not secret_key:
        raise RuntimeError("SECRET_KEY not found in environment variables")

    app.config["SECRET_KEY"] = secret_key
    app.config["JWT_SECRET_KEY"] = secret_key

    JWTManager(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(internship_bp, url_prefix="/api/internships")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(company_bp, url_prefix="/api/company")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    return app


app = create_app()


# Start scheduler only once
if os.environ.get("RENDER"):
    start_scheduler()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)