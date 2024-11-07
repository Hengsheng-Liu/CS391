from sqlalchemy.orm import Session
from models.user import UserDB
from schemas.user import UserRequest

def get_user(db: Session, user_id: int):
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(UserDB).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserRequest):
    db_user = UserDB(name=user.name, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(UserDB).filter(UserDB.email == email).first()