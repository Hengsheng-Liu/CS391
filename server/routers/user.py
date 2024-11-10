from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.user import UserDB
from schemas.user import UserRequest, UserResponse, LoginRequest
from database import get_db
from crud.user import get_user, get_users, create_user, get_user_by_email

router = APIRouter()

# Route to create a new user
@router.post("/user", response_model=UserResponse)
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
@router.get("/users/",response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(UserDB).all()
        return users
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch users. {error}")
    
# Route to get a user by ID
@router.get("/user/{user_id}", response_model=UserResponse)
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
@router.post("/login", response_model=bool)
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