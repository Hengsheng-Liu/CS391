from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.event import EventCreate, EventResponse
from database import get_db
from crud.event import create_event, get_event, get_events, get_event_by_food_type

router = APIRouter()

# Route to create a new event
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
@router.get("/events/id/{event_id}", response_model=EventResponse)
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

# Route to get events by food type
@router.get("/events/food/{food_type}", response_model=List[EventResponse])
async def get_event_by_food_type_route(food_type: str, db: Session = Depends(get_db)):
    try:
        events = get_event_by_food_type(db, food_type)
        return events
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=f"Failed to fetch events. {error}")