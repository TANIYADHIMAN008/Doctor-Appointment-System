from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient

router = APIRouter()


# =========================
# MARK PAYMENT PAID
# =========================

@router.put("/patients/{patient_id}/pay")
def mark_fee_paid(patient_id: int, db: Session = Depends(get_db)):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    patient.fee_paid = True

    db.commit()

    return {"message": "Payment successful"}