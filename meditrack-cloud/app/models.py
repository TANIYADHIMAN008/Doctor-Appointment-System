from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# =========================
# USER MODEL
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)

    role = Column(String, default="doctor")

    specialization = Column(String)
    phone = Column(String)   # ✅ already here
    experience = Column(String)
    hospital_name = Column(String)

    doctor_fee = Column(Integer, default=500)

    created_at = Column(DateTime, default=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="doctor")


# =========================
# PATIENT MODEL (UPDATED)
# =========================
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    phone = Column(String, nullable=True)   # ✅ ADDED

    gender = Column(String)
    age = Column(Integer)

    past_history = Column(String)
    status = Column(String, default="Active")

    registration_status = Column(String, default="Pending")
    fee_paid = Column(Boolean, default=False)

    doctor_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="patient")


# =========================
# APPOINTMENT MODEL
# =========================
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))

    date = Column(String, nullable=False)
    time = Column(String)

    status = Column(String, default="Pending")
    payment_status = Column(String, default="Unpaid")

    patient_name = Column(String)
    doctor_name = Column(String)
    hospital = Column(String)
    specialization = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("User", back_populates="appointments")