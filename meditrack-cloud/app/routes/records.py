from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.medical_record import MedicalRecord

router = APIRouter()

@router.get("/records/{patient_id}")
def get_records(patient_id:int, db:Session=Depends(SessionLocal)):
    return db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient_id
    ).all()