import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")
client = MongoClient(MONGODB_URL)
db = client["patient_management"]

patients_collection = db["patients"]
counters_collection = db["counters"]
case_sheets_collection = db["case_sheets"]
