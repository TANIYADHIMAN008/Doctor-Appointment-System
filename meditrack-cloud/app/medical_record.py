from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class MedicalRecord(Base):

    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    diagnosis = Column(String)
    treatment = Column(String)