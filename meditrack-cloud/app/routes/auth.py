from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    get_current_user
)

import requests

router = APIRouter()


# ===============================
# REGISTER USER / DOCTOR
# ===============================
@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email,
        models.User.role == user.role
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail=f"{user.role} with this email already exists"
        )

    hashed_password = get_password_hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        specialization=user.specialization,
        phone=user.phone,
        experience=user.experience,
        hospital_name=user.hospital_name,
        doctor_fee=user.doctor_fee
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🔥 N8N WEBHOOK
    try:
        url = "http://localhost:5678/webhook-test/3cb2cb77-4752-4c34-b15a-15f294cccf6c"

        data = {
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }

        requests.post(url, json=data, timeout=5)

    except requests.exceptions.RequestException as e:
        print("❌ Webhook error:", e)

    return new_user


# ===============================
# LOGIN (🔥 FIXED TOKEN)
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

    if user:
        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=400,
                detail="Incorrect email or password"
            )

        # 🔥 IMPORTANT FIX
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "role": user.role   # ✅ FIX
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

    raise HTTPException(
        status_code=400,
        detail="Incorrect email or password"
    )


# ===============================
# RESET PASSWORD
# ===============================
@router.post("/reset-password")
def reset_password(
    email: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(new_password)
    db.commit()

    return {"message": "Password updated successfully ✅"}


# ===============================
# GET CURRENT USER
# ===============================
@router.get("/me", response_model=schemas.UserResponse)
def read_current_user(
    current_user: models.User = Depends(get_current_user)
):
    return current_user