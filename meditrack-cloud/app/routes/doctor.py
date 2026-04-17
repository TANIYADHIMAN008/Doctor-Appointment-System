from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests

from app.database import get_db
from app.models import User
from app.auth import get_password_hash, create_access_token

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)

# =========================
# REGISTER DOCTOR
# =========================
@router.post("/register")
def register_doctor(data: dict, db: Session = Depends(get_db)):

    # ✅ Check if already exists
    existing_user = db.query(User).filter(User.email == data.get("email")).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # ✅ Validate required fields
    if not data.get("name") or not data.get("email") or not data.get("password"):
        raise HTTPException(status_code=400, detail="Missing required fields")

    # ✅ Hash password
    hashed_password = get_password_hash(data["password"])

    # ✅ Create doctor
    new_doctor = User(
        name=data.get("name"),
        email=data.get("email"),
        phone=data.get("phone"),
        specialization=data.get("specialization"),
        experience=data.get("experience"),
        hospital_name=data.get("hospital_name"),
        doctor_fee=data.get("doctor_fee"),
        password=hashed_password,
        role="doctor"
    )

    # ✅ Save to DB
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    print("✅ Doctor saved:", new_doctor.email)

    # =========================
    # 🔥 N8N WEBHOOK CALL
    # =========================
    try:
        url = "http://localhost:5678/webhook-test/3cb2cb77-4752-4c34-b15a-15f294cccf6c"

        payload = {
            "name": new_doctor.name,
            "email": new_doctor.email,
            "role": "doctor"
        }

        print("🚀 Sending to n8n:", payload)

        response = requests.post(url, json=payload, timeout=5)

        print("✅ n8n Status:", response.status_code)
        print("✅ n8n Response:", response.text)

    except requests.exceptions.RequestException as e:
        print("❌ Webhook error:", e)

    # =========================
    # TOKEN (AUTO LOGIN)
    # =========================
    access_token = create_access_token({"sub": str(new_doctor.id)})

    return {
        "message": "Doctor registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_doctor.id,
            "name": new_doctor.name,
            "email": new_doctor.email,
            "role": new_doctor.role
        }
    }


# =========================
# GET ALL DOCTORS
# =========================
@router.get("/")
def get_doctors(db: Session = Depends(get_db)):

    doctors = db.query(User).filter(User.role == "doctor").all()

    return [
        {
            "id": d.id,
            "name": d.name,
            "email": d.email,
            "specialization": d.specialization,
            "experience": d.experience,
            "hospital_name": d.hospital_name,
            "doctor_fee": d.doctor_fee
        }
        for d in doctors
    ]