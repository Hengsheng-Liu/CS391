from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.event import EventCreate, EventResponse
from database import get_db
from crud.event import create_event, delete_event, get_event, get_events, get_all_participants, update_event
from crud.rsvp import delete_rsvp, get_rsvp
router = APIRouter()

# Route to create a new event
@router.post("/event", response_model=EventResponse)
async def create_event_route(event: EventCreate, db: Session = Depends(get_db)):
    try:
        new_event = create_event(db, event)
        new_event.participants = []
        return new_event
    except Exception as error:
        db.rollback()
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to create event. {error}")
@router.delete("/event/{event_id}")
async def delete_event_route(event_id: int, db: Session = Depends(get_db)):
    try:
        delete_event(db, event_id)
        return {"message": "Event deleted successfully."}
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to delete event. {error}")
# Route to get all events
@router.get("/events", response_model=List[EventResponse])
async def get_events_route(db: Session = Depends(get_db)):
    try:
        events = get_events(db)
        for event in events:
            event.participants = []
        return events
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch events. {error}")

# Route to update an event 
@router.put("/event/{event_id}", response_model=EventResponse)
async def update_event_route(event_id: int, event: EventCreate, db: Session = Depends(get_db)):
    try:
        updated_event = update_event(db, event_id, event)
        updated_event.participants = get_all_participants(db, event_id)
        return updated_event
    except Exception as error:
        db.rollback()
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to update event. {error}")
# Route to get an event by ID
@router.get("/event/id/{event_id}", response_model=EventResponse)
async def get_event_route(event_id: int, db: Session = Depends(get_db)):
    try:
        event = get_event(db, event_id)
        event.participants = get_all_participants(db, event_id)
        if event:
            return event
        else:
            raise HTTPException(status_code=404, detail="Event not found.")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch event. {error}")



