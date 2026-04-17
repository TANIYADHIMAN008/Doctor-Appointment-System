from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================
# DATABASE URL
# =========================

DATABASE_URL = "sqlite:///./meditrack.db"

# =========================
# CREATE ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # required for SQLite
)

# =========================
# SESSION LOCAL
# =========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================
# BASE MODEL
# =========================

Base = declarative_base()


# =========================
# DATABASE DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()