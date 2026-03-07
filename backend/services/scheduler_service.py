from apscheduler.schedulers.background import BackgroundScheduler
from services.external_internship_service import fetch_adzuna_internships


def start_scheduler():
    scheduler = BackgroundScheduler()

    # 🔥 Fetch internships every 12 hours
    scheduler.add_job(
        func=fetch_adzuna_internships,
        trigger="interval",
        hours=12,
        args=["internship", "in"]
    )

    scheduler.start()
    print("✅ Background Scheduler Started")

    return scheduler