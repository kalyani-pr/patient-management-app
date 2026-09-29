from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, Literal

class PatientCreate(BaseModel):
    name: str
    date_of_birth: date
    gender: Literal["Male", "Female", "Other"]
    phone: str
    address: str

class CaseSheetCreate(BaseModel):
    chief_complaint: str
    duration: str
    pain_level: Optional[int] = Field(default=None, ge=1, le=10)
    affected_tooth_area: str
    examination_findings: str
    tenderness: Literal["Yes", "No"]
    sensitivity: Literal["Hot", "Cold", "Both", "None"]
    other_observations: Optional[str] = None
    clinical_diagnosis: str
    clinical_notes: Optional[str] = None
    recommended_care: Optional[str] = None

class PatientResponse(BaseModel):
    patient_id: str
    name: str
    date_of_birth: date
    gender: Literal["Male", "Female", "Other"]
    phone: str
    address: str
