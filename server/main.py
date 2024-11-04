# =========================================== Imports ===========================================

from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn
from contextlib import asynccontextmanager

# ======================================== Database Setup ========================================

# Database connection details
DATABASE_URL = "postgresql://p_user:p_password@localhost:5432/cs391"
# Establishing a connection to the database
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# UserDB model for SQLAlchemy
class UserDB(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)  
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic model for API responses
Base.metadata.create_all(bind=engine)
class UserRequest(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        orm_mode = True
class LoginRequest(BaseModel):
    email: str
    password: str
# ======================================== Dependency Injection =================================
# Dependency to get a new database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================== App Setup ===========================================

# Creating a FastAPI instance
app = FastAPI()

# Setting up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================ Routing ============================================

# Route to create a new user
@app.post("/user", response_model=UserResponse)
async def create_user(user: UserRequest, db: Session = Depends(get_db)):
    try:
        NewUser = UserDB(name=user.name, email=user.email, password=user.password)
        db.add(NewUser)
        db.commit()
        db.refresh(NewUser)
        return UserResponse(**NewUser.__dict__)
    except Exception as error:
        print(error)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user. {error}")
# Route to get all users
@app.get("/users/",response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(UserDB).all()
        return users
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch users. {error}")
# Route to get a user by ID
@app.get("/user/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDB).filter(UserDB.id == user_id).first()
        if user:
            return user
        else:
            raise HTTPException(status_code=404, detail="User not found.")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch user. {error}")
@app.post("/login", response_model=bool)
async def login_user(user: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDB).filter(UserDB.email == user.email).filter(UserDB.password == user.password).first()
        if user:
            return True
        else:
            return False
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch user. {error}")
# ======================================== Run the App ============================================
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# ================================================================================================
