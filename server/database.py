from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ======================================== Database Setup ========================================

# Database connection details
DATABASE_URL = "postgresql://p_user:p_password@localhost:5432/cs391"
# Establishing a connection to the database
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ======================================== Dependency Injection =================================
# Dependency to get a new database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()