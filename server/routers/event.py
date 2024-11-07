from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.event import EventDB
from schemas.event import EventCreate, EventResponse
from database import get_db
from crud.event import create_event, get_event, get_events

router = APIRouter()

# Route to create a new user
@router.post("/event", response_model=EventResponse)
async def create_event_route(event: EventCreate, db: Session = Depends(get_db)):
    try:
        new_event = create_event(db, event)
        return new_event
    except Exception as error:
        db.rollback()
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to create event. {error}")

# Route to get all events
@router.get("/events", response_model=List[EventResponse])
async def get_events_route(db: Session = Depends(get_db)):
    try:
        events = get_events(db)
        return events
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch events. {error}")

# Route to get an event by ID
@router.get("/event/{event_id}", response_model=EventResponse)
async def get_event_route(event_id: int, db: Session = Depends(get_db)):
    try:
        event = get_event(db, event_id)
        if event:
            return event
        else:
            raise HTTPException(status_code=404, detail="Event not found.")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch event. {error}")