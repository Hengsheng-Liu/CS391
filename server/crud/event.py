from sqlalchemy.orm import Session
from models.event import EventDB
from schemas.event import EventCreate

def create_event(db: Session, event: EventCreate):
    db_event = EventDB(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event(db: Session, event_id: int):
    return db.query(EventDB).filter(EventDB.id == event_id).first()

def get_events(db: Session, skip: int = 0, limit: int = 10):
    return db.query(EventDB).offset(skip).limit(limit).all()