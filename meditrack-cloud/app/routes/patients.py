from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import requests

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, get_password_hash

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

# ===============================
# CREATE PATIENT (UPDATED 🔥)
# ===============================
@router.post("/", response_model=schemas.PatientResponse)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        doctor_id = patient.doctor_id if patient.doctor_id else current_user.id

        password = get_password_hash(patient.password) if patient.password else current_user.password

        new_patient = models.Patient(
            name=patient.name,
            email=patient.email,
            password=password,
            phone=patient.phone,   # ✅ ADDED
            gender=getattr(patient, "gender", "Not Specified"),
            age=patient.age,
            past_history=getattr(patient, "past_history", ""),
            status=getattr(patient, "status", "Active"),
            doctor_id=doctor_id
        )

        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        # 🔥 n8n webhook
        try:
            requests.post(
                "http://localhost:5678/webhook-test/1cee2421-28d4-4b08-acb5-ce4005394b65",
                json={
                    "name": new_patient.name,
                    "email": new_patient.email,
                    "phone": new_patient.phone   # ✅ ADDED
                }
            )
        except Exception as e:
            print("n8n webhook error:", e)

        return new_patient

    except Exception as e:
        print("🔥 BACKEND ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ===============================
# GET ALL PATIENTS
# ===============================
@router.get("/all", response_model=List[schemas.PatientResponse])
def get_all_patients(db: Session = Depends(get_db)):
    try:
        return db.query(models.Patient).all()
    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ===============================
# GET MY PATIENTS
# ===============================
@router.get("/", response_model=List[schemas.PatientResponse])
def get_my_patients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        return db.query(models.Patient).filter(
            models.Patient.doctor_id == current_user.id
        ).all()
    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ===============================
# UPDATE PATIENT
# ===============================
@router.put("/{patient_id}", response_model=schemas.PatientResponse)
def update_patient(
    patient_id: int,
    updated_data: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        patient = db.query(models.Patient).filter(
            models.Patient.id == patient_id
        ).first()

        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        patient.name = updated_data.name
        patient.email = updated_data.email or patient.email
        patient.phone = updated_data.phone or patient.phone   # ✅ ADDED

        if updated_data.password:
            patient.password = get_password_hash(updated_data.password)

        patient.gender = getattr(updated_data, "gender", "Not Specified")
        patient.age = updated_data.age
        patient.past_history = getattr(updated_data, "past_history", "")
        patient.status = getattr(updated_data, "status", "Active")

        db.commit()
        db.refresh(patient)

        return patient

    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ===============================
# DELETE PATIENT
# ===============================
@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        patient = db.query(models.Patient).filter(
            models.Patient.id == patient_id
        ).first()

        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        db.delete(patient)
        db.commit()

    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))