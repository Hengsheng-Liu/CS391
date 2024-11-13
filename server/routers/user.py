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
        CheckDuplicateEmail = db.query(UserDB).filter(UserDB.email == user.email).first()
        if CheckDuplicateEmail:
            raise HTTPException(status_code=400, detail="Email already exists.")
        NewUser = UserDB(name=user.name, email=user.email, password=user.password)
        db.add(NewUser)
        db.commit()
        db.refresh(NewUser)
        return UserResponse(**NewUser.__dict__)
    except HTTPException as error:
        raise error
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user." + str(error))
# Route to login a user
@router.get("/user", response_model=UserResponse)
async def login_user(user: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(UserDB).filter(UserDB.email == user.email).filter(UserDB.password == user.password).first()
        if user:
            return UserResponse(**user.__dict__)
        else:
            raise HTTPException(status_code=404, detail="User not found.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user. {error}")
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
