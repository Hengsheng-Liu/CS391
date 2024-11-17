from sqlalchemy.orm import Session
from model import RsvpDB
from schemas.rsvp import Rsvp

#create rsvp 
def create_rsvp(db: Session, rsvp: Rsvp):
    db_rsvp = RsvpDB(
        user_id=rsvp.user_id,
        event_id=rsvp.event_id
    )
    db.add(db_rsvp)
    db.commit()
    db.refresh(db_rsvp)
    return db_rsvp
# Get rsvp by ID
def get_rsvp(db: Session, rsvp_id: int):
    return db.query(RsvpDB).filter(RsvpDB.event_id == rsvp_id).all()
# Get all rsvp
def delete_rsvp(db: Session, rsvp_id: int, user_id: int):
    result = db.query(RsvpDB).filter(RsvpDB.event_id == rsvp_id, RsvpDB.user_id == user_id).delete()
    print("delete result", result)  
    db.commit()
    return {"message": "RSVP deleted successfully."}

