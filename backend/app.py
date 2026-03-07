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

    # 🔥 Load SECRET KEY from .env
    secret_key = os.getenv("SECRET_KEY")

    if not secret_key:
        raise RuntimeError("SECRET_KEY not found in .env file")

    app.config["SECRET_KEY"] = secret_key
    app.config["JWT_SECRET_KEY"] = secret_key

    print("SECRET KEY:", app.config["SECRET_KEY"])

    JWTManager(app)
    CORS(app)

    # 🔥 Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(internship_bp, url_prefix="/api/internships")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(company_bp, url_prefix="/api/company")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    start_scheduler()

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)