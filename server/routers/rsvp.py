from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from schemas.event import EventCreate
from crud.event import get_event, update_event
from model import RsvpDB
from schemas.rsvp import Rsvp
from database import get_db
from crud.rsvp import get_rsvp, create_rsvp, delete_rsvp

router = APIRouter()

@router.post("/", status_code=201)
async def create_rsvp_route(rsvp: Rsvp, db: Session = Depends(get_db)):
    try:
        new_rsvp = create_rsvp(db, rsvp)  
        event = get_event(db, rsvp.event_id)  
        event_data = EventCreate(**event.__dict__)
        event_data.rsvp_count -= 1
        update_event(db, rsvp.event_id, event_data)  
        db.commit()
        return {"message": "RSVP created successfully", "rsvp_id": new_rsvp.id}
    except Exception as error:
        db.rollback()
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to create rsvp. {error}")

@router.delete("/")
async def delete_rsvp_route(rsvp_id: int, user_id: int, db: Session = Depends(get_db)):
    try:
        delete_rsvp(db, rsvp_id, user_id)  
        event =  get_event(db, rsvp_id)  
        event_data = EventCreate(**event.__dict__)
        event_data.rsvp_count += 1
        update_event(db, rsvp_id, event_data)  
        db.commit()
        return {"message": "RSVP deleted successfully."}
    except Exception as error:
        db.rollback()
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to delete rsvp. {error}")
