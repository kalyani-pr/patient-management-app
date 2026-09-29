from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.database import patients_collection, case_sheets_collection
from app.schemas import PatientCreate, PatientResponse, CaseSheetCreate
from app.utils import generate_patient_id
from datetime import datetime, time
from fastapi import HTTPException
from app.ai import generate_ai_summary
from app.utils import calculate_age

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Patient routes
@app.post("/patients", response_model=PatientResponse)
def create_patient(patient: PatientCreate):
    patient_id = generate_patient_id()
    patient_data = patient.model_dump()
    patient_data["patient_id"] = patient_id
    patient_data["date_of_birth"] = datetime.combine(patient_data["date_of_birth"], time.min)
    patients_collection.insert_one(patient_data)
    return patient_data

@app.get("/patients", response_model=list[PatientResponse])
def get_patients():
    patients = patients_collection.find({}, {"_id": 0})
    return list(patients)

@app.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str):
    patient = patients_collection.find_one(
        {"patient_id": patient_id},
        {"_id": 0}
    )
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.put("/patients/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, patient: PatientCreate):
    existing_patient = patients_collection.find_one({"patient_id": patient_id})
    if existing_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient_data = patient.model_dump()
    patient_data["date_of_birth"] = datetime.combine(patient_data["date_of_birth"], time.min)
    patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": patient_data}
    )
    updated_patient = patients_collection.find_one(
        {"patient_id": patient_id},
        {"_id": 0}
    )
    return updated_patient


#Case sheet routes
@app.post("/patients/{patient_id}/case-sheet")
def create_case_sheet(patient_id: str, case_sheet: CaseSheetCreate):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    case_sheet_data = case_sheet.model_dump()
    case_sheet_data["patient_id"] = patient_id
    case_sheets_collection.insert_one(case_sheet_data)
    case_sheet_data.pop("_id", None)
    return {"message": "Case sheet created successfully",
            "patient_id": patient_id,
            "case_sheet": case_sheet_data}

@app.get("/patients/{patient_id}/case-sheet")
def get_case_sheet(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    case_sheet = case_sheets_collection.find_one({"patient_id": patient_id},)
    if case_sheet is None:
        raise HTTPException(status_code=404, detail="Case sheet not found")
    case_sheet.pop("_id", None)
    return case_sheet

@app.put("/patients/{patient_id}/case-sheet")
def update_case_sheet(patient_id: str, case_sheet: CaseSheetCreate):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    existing_case_sheet = case_sheets_collection.find_one({"patient_id": patient_id})
    if existing_case_sheet is None:
        raise HTTPException(status_code=404, detail="Case sheet not found")
    
    updated_data = case_sheet.model_dump()
    case_sheets_collection.update_one({"patient_id": patient_id}, {"$set": updated_data})
    return {"message": "Case sheet updated successfully",
            "patient_id": patient_id,
            "case_sheet": updated_data}

#AI summary route
@app.get("/patients/{patient_id}/ai-summary")
def get_ai_summary(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    case_sheet = case_sheets_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if case_sheet is None:
        raise HTTPException(status_code=404, detail="Case sheet not found")

    date_of_birth = patient.get("date_of_birth")
    if not date_of_birth:
        raise HTTPException(status_code=400, detail="Date of birth is missing")

    try:
        age = calculate_age(date_of_birth)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid date of birth")

    try:
        summary = generate_ai_summary(patient, case_sheet, age)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI summary: {str(e)}")

    return {"patient_id": patient_id, "summary": summary}
    
