from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient

router = APIRouter()


# =========================
# APPROVE PATIENT
# =========================

@router.put("/patients/{patient_id}/approve")
def approve_patient(patient_id: int, db: Session = Depends(get_db)):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    patient.registration_status = "Approved"

    db.commit()

    return {"message": "Patient Approved"}