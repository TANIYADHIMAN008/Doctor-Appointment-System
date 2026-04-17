from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ==============================
# USER SCHEMAS
# ==============================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

    specialization: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[str] = None
    hospital_name: Optional[str] = None
    doctor_fee: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    specialization: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[str] = None
    hospital_name: Optional[str] = None
    doctor_fee: Optional[int] = None

    class Config:
        from_attributes = True


# ==============================
# PATIENT SCHEMAS (UPDATED 🔥)
# ==============================

class PatientCreate(BaseModel):
    name: str
    gender: Optional[str] = None
    age: int

    past_history: Optional[str] = None
    status: Optional[str] = "Active"

    email: Optional[str] = None
    password: Optional[str] = None

    phone: Optional[str] = None   # ✅ ADDED

    aadhaar: Optional[str] = None
    pan: Optional[str] = None

    doctor_id: Optional[int] = None


class PatientResponse(BaseModel):
    id: int
    name: str
    gender: Optional[str] = None
    age: int
    past_history: Optional[str]
    status: str

    registration_status: str
    fee_paid: bool

    doctor_id: Optional[int]
    created_at: datetime

    email: Optional[str] = None
    phone: Optional[str] = None   # ✅ ADDED

    class Config:
        from_attributes = True


# ==============================
# APPOINTMENT SCHEMAS
# ==============================

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: Optional[int] = None

    visit_type: Optional[str] = None
    disease_history: Optional[str] = None

    date: str
    time: str

    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int

    patient_id: int
    doctor_id: Optional[int]

    visit_type: Optional[str]
    disease_history: Optional[str]

    date: str
    time: str

    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True