from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# DB
from app.database import engine
from app import models

# ROUTES
from app.routes.users import router as users_router
from app.routes.patients import router as patients_router
from app.routes.appointments import router as appointments_router
from app.routes.records import router as records_router
from app.routes.doctor import router as doctors_router
from app.routes.queue_routes import router as queue_router

# CREATE APP
app = FastAPI(
    title="DocConnect Cloud API",
    version="1.0.0"
)

# =========================
# 🔥 CORS FIX (FINAL)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",     # 🔥 ADD THIS
        "http://127.0.0.1:5174",     # 🔥 ADD THIS
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREATE TABLES
models.Base.metadata.create_all(bind=engine)

# ROUTES
app.include_router(users_router)
app.include_router(patients_router)
app.include_router(appointments_router)
app.include_router(records_router)
app.include_router(doctors_router)
app.include_router(queue_router)

# ROOT
@app.get("/")
def root():
    return {"message": "DocConnect API Running 🚀"}