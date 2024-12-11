from typing import List
from sqlalchemy.orm import Session
from model import UserDB, EventDB, RsvpDB
from schemas.user import UserResponse
from schemas.event import EventCreate
from send_email import send_email_notification
# Create event 
def create_event(db: Session, event: EventCreate):
    db_event = EventDB(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    # Call the send_email_notification function
    send_email_notification(db_event)
    return db_event

# Update event
def update_event(db: Session, event_id: int, event: EventCreate):
    db.query(EventDB).filter(EventDB.id == event_id).update(event.dict())
    db.commit()
    return db.query(EventDB).filter(EventDB.id == event_id).first()

# Get event by ID
def get_event(db: Session, event_id: int):
    return db.query(EventDB).filter(EventDB.id == event_id).first()

# Get all events
def get_events(db: Session, skip: int = 0, limit: int = 10):
    return db.query(EventDB).offset(skip).limit(limit).all()

# Get all participants for an event
def get_all_participants(db: Session, event_id: int):
    participants_ids = db.query(RsvpDB).filter(RsvpDB.event_id == event_id).all()
    participants_ids = [participant.user_id for participant in participants_ids]
    participants: List[UserResponse] = []
    for id in participants_ids:
        user = db.query(UserDB).filter(UserDB.id == id).first()
        object = UserResponse(**user.__dict__)
        participants.append(object)
    return participants

# Delete event
def delete_event(db: Session, event_id: int):
    db.query(EventDB).filter(EventDB.id == event_id).delete()
    db.commit()
    return {"message": "Event deleted successfully."}