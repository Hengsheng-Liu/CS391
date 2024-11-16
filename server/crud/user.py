from sqlalchemy.orm import Session
from model import UserDB
from schemas.user import UserRequest

#Get user by ID
def get_user(db: Session, user_id: int):
    return db.query(UserDB).filter(UserDB.id == user_id).first()

#Get all users
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(UserDB).offset(skip).limit(limit).all()

#Create user
def create_user(db: Session, user: UserRequest):
    db_user = UserDB(name=user.name, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(UserDB).filter(UserDB.email == email).first()