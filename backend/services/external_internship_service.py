import requests
import os


def fetch_adzuna_internships(keyword="internship", location="india"):

    APP_ID = os.getenv("ADZUNA_APP_ID")
    APP_KEY = os.getenv("ADZUNA_APP_KEY")

    if not APP_ID or not APP_KEY:
        print("❌ Adzuna credentials missing in .env")
        return []

    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": keyword,
        "where": location,
        "content-type": "application/json"
    }

    try:
        response = requests.get(url, params=params, timeout=10)

        print("Adzuna Status Code:", response.status_code)

        if response.status_code != 200:
            print("❌ Adzuna API Error:", response.text)
            return []

        data = response.json()

        results = data.get("results", [])

        internships = []

        for job in results:
            internships.append({
                "title": job.get("title"),
                "company": job.get("company", {}).get("display_name"),
                "location": job.get("location", {}).get("display_name"),
                "description": job.get("description"),
                "source": "adzuna"
            })

        return internships

    except requests.exceptions.RequestException as e:
        print("❌ Network Error:", e)
        return []