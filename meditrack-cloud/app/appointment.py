from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Appointment, User, Patient
from app.auth import get_current_user

router = APIRouter()


# ===============================
# CREATE APPOINTMENT (FIXED)
# ===============================
@router.post("/appointments")
def create_appointment(
    appt: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doctor_id = appt.get("doctor_id")
    date = appt.get("date")
    patient_id = appt.get("patient_id")   # ✅ MUST COME FROM FRONTEND

    if not doctor_id or not date or not patient_id:
        raise HTTPException(status_code=400, detail="doctor_id, patient_id and date required")

    # ✅ GET DOCTOR
    doctor = db.query(User).filter(User.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # ✅ GET PATIENT (REAL FIX)
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # ✅ CREATE APPOINTMENT (CORRECT DATA)
    new_appt = Appointment(
        doctor_id=doctor.id,
        patient_id=patient.id,
        date=date,
        time=None,
        status="Pending",
        payment_status="Unpaid",

        doctor_name=doctor.name,
        patient_name=patient.name,   # ✅ NOW CORRECT
        hospital=doctor.hospital_name,
        specialization=doctor.specialization
    )

    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)

    return new_appt


# ===============================
# GET PATIENT APPOINTMENTS
# ===============================
@router.get("/appointments")
def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointments = db.query(Appointment).filter(
        Appointment.patient_id == current_user.id
    ).all()

    return [
        {
            "id": a.id,
            "date": str(a.date),   # ✅ ensure string
            "time": a.time,
            "status": a.status,
            "payment_status": a.payment_status,
            "patient_name": a.patient_name,
            "doctor_name": a.doctor_name,
            "hospital": a.hospital,
            "specialization": a.specialization
        }
        for a in appointments
    ]


# ===============================
# GET DOCTOR APPOINTMENTS
# ===============================
@router.get("/appointments/doctor")
def get_doctor_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id
    ).all()

    return [
        {
            "id": a.id,
            "date": str(a.date),   # ✅ ensure string
            "time": a.time,
            "status": a.status,
            "payment_status": a.payment_status,
            "patient_name": a.patient_name,
            "doctor_name": a.doctor_name,
            "hospital": a.hospital,
            "specialization": a.specialization
        }
        for a in appointments
    ]


# ===============================
# UPDATE STATUS
# ===============================
@router.put("/appointments/{appt_id}")
def update_status(appt_id: int, data: dict, db: Session = Depends(get_db)):

    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = data.get("status", appt.status)

    db.commit()
    db.refresh(appt)

    return {"message": "Status updated"}


# ===============================
# SET TIME
# ===============================
@router.put("/appointments/{appt_id}/time")
def set_time(appt_id: int, data: dict, db: Session = Depends(get_db)):

    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.time = data.get("time")

    db.commit()

    return {"message": "Time updated"}


# ===============================
# MARK PAYMENT
# ===============================
@router.put("/appointments/{appt_id}/pay")
def mark_paid(appt_id: int, db: Session = Depends(get_db)):

    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.payment_status = "Paid"

    db.commit()
    db.refresh(appt)

    return {
        "message": "Payment updated",
        "payment_status": appt.payment_status
    }