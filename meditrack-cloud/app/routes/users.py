from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
import requests

from .. import models
from ..database import get_db
from ..auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    get_current_user
)

router = APIRouter()


# ===============================
# REGISTER (Doctor / Patient)
# ===============================
@router.post("/register")
def register_user(user: dict, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user["email"]
    ).first()

    # ===============================
    # UPDATE EXISTING USER
    # ===============================
    if existing_user:

        existing_user.role = user.get("role", existing_user.role)
        existing_user.specialization = user.get("specialization")
        existing_user.phone = user.get("phone")
        existing_user.experience = user.get("experience")
        existing_user.hospital_name = user.get("hospital_name")
        existing_user.doctor_fee = user.get("doctor_fee")

        db.commit()
        db.refresh(existing_user)

        # 🔥 N8N WEBHOOK (UPDATE CASE)
        try:
            url = "http://localhost:5678/webhook/f3fe6674-f4a1-4c1e-87f7-572c82ba249d"

            payload = {
                "name": existing_user.name,
                "email": existing_user.email,
                "role": existing_user.role
            }

            print("🚀 Sending (update) to n8n:", payload)

            response = requests.post(url, json=payload, timeout=5)

            print("✅ n8n Status:", response.status_code)
            print("✅ n8n Response:", response.text)

        except Exception as e:
            print("❌ n8n error:", e)

        access_token = create_access_token(data={"sub": str(existing_user.id)})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": existing_user.id,
                "email": existing_user.email,
                "role": existing_user.role,
                "name": existing_user.name
            }
        }

    # ===============================
    # CREATE NEW USER
    # ===============================
    hashed_password = get_password_hash(user["password"])

    new_user = models.User(
        name=user.get("name"),
        email=user.get("email"),
        password=hashed_password,
        role=user.get("role"),
        specialization=user.get("specialization"),
        phone=user.get("phone"),
        experience=user.get("experience"),
        hospital_name=user.get("hospital_name"),
        doctor_fee=user.get("doctor_fee")
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print("✅ New user created:", new_user.email)

    # 🔥 N8N WEBHOOK (NEW USER)
    try:
        url = "http://localhost:5678/webhook-test/3cb2cb77-4752-4c34-b15a-15f294cccf6c"
        payload = {
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }

        print("🚀 Sending (new) to n8n:", payload)

        response = requests.post(url, json=payload, timeout=5)

        print("✅ n8n Status:", response.status_code)
        print("✅ n8n Response:", response.text)

    except Exception as e:
        print("❌ n8n error:", e)

    access_token = create_access_token(data={"sub": str(new_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "name": new_user.name
        }
    }


# ===============================
# LOGIN
# ===============================
@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.email == username
    ).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    }


# ===============================
# CURRENT USER
# ===============================
@router.get("/me")
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "name": current_user.name
    }