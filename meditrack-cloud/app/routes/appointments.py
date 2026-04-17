from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Appointment, User
from app.auth import get_current_user
import requests

router = APIRouter()

# ===============================
# CREATE APPOINTMENT (FINAL FIX)
# ===============================
@router.post("/appointments")
def create_appointment(
    appt: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doctor_id = appt.get("doctor_id")
    date = appt.get("date")

    # 🔥 SECURITY FIX
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book")

    # 🔥 ALWAYS CORRECT PATIENT
    patient_id = current_user.id

    if not doctor_id or not date:
        raise HTTPException(status_code=400, detail="Missing data")

    doctor = db.query(User).filter(User.id == doctor_id).first()
    patient = db.query(User).filter(User.id == patient_id).first()

    if not doctor or not patient:
        raise HTTPException(status_code=404, detail="User not found")

    new_appt = Appointment(
        doctor_id=doctor.id,
        patient_id=patient.id,

        # ✅ correct names
        doctor_name=doctor.name,
        patient_name=patient.name,

        specialization=doctor.specialization,
        hospital=doctor.hospital_name,

        date=date,
        time=None,
        status="Pending",
        payment_status="Unpaid"
    )

    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)

    return new_appt


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
            "date": a.date,
            "time": a.time,
            "status": a.status,
            "payment_status": a.payment_status,
            "patient_name": a.patient_name,
            "doctor_name": a.doctor_name,
            "specialization": a.specialization,
            "hospital": a.hospital
        }
        for a in appointments
    ]


# ===============================
# GET PATIENT APPOINTMENTS
# ===============================
@router.get("/appointments/patient")
def get_patient_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointments = db.query(Appointment).filter(
        Appointment.patient_id == current_user.id
    ).all()

    return [
        {
            "id": a.id,
            "date": a.date,
            "time": a.time,
            "status": a.status,
            "payment_status": a.payment_status,
            "patient_name": a.patient_name,
            "doctor_name": a.doctor_name,
            "specialization": a.specialization,
            "hospital": a.hospital
        }
        for a in appointments
    ]


# ===============================
# UPDATE STATUS
# ===============================
@router.put("/appointments/{appt_id}")
def update_status(
    appt_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if "status" in data:
        appt.status = data["status"]

    db.commit()
    db.refresh(appt)

    # 🔥 N8N WEBHOOK
    if appt.status and appt.status.lower() in ["accepted", "rejected"]:
        patient = db.query(User).filter(User.id == appt.patient_id).first()
        doctor = db.query(User).filter(User.id == appt.doctor_id).first()

        payload = {
            "patient_email": patient.email if patient else "",
            "patient_name": patient.name if patient else "",
            "phone": patient.phone if patient else "",
            "doctor_name": appt.doctor_name,
            "doctor_phone": doctor.phone if doctor else "N/A",
            "date": str(appt.date),
            "time": str(appt.time),
            "status": appt.status
        }

        try:
            requests.post(
                "http://localhost:5678/webhook-test/8e892181-4260-4aa3-a58a-d2a02cfa56da",
                json=payload,
                timeout=5
            )
        except Exception as e:
            print("Webhook error:", e)

    return {"message": "Status updated successfully"}


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