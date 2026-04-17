from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Appointment

router = APIRouter()

@router.get("/queue/{appointment_id}")
def get_queue(appointment_id: int, db: Session = Depends(get_db)):

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        return {"error": "Appointment not found"}

    patients_ahead = db.query(Appointment).filter(
        Appointment.doctor_id == appointment.doctor_id,
        Appointment.time < appointment.time,
        Appointment.status == "waiting"
    ).count()

    estimated_wait = patients_ahead * 5

    return {
        "patients_ahead": patients_ahead,
        "estimated_wait_minutes": estimated_wait
    }