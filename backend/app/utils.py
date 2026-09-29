from app.database import counters_collection
from pymongo import ReturnDocument
from datetime import date, datetime

def generate_patient_id():
    counter = counters_collection.find_one_and_update(
        {"_id": "patient_id"},
        {"$inc": {"sequence": 1}},
        upsert = True,
        return_document = ReturnDocument.AFTER
    )
    return f"PAT-{counter['sequence']:04d}"

def calculate_age(date_of_birth):
    if isinstance(date_of_birth, datetime):
        date_of_birth = date_of_birth.date()

    elif isinstance(date_of_birth, str):
        date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()

    today = date.today()
    age = today.year - date_of_birth.year
    if(today.month, today.day) < (date_of_birth.month, date_of_birth.day):
        age -= 1
    return age
