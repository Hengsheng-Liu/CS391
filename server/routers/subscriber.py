from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.subscriber import Subscriber
from crud.subscriber import create_subscriber, get_subscriber, delete_subscriber

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route to create a new subscriber
@router.post("/notification/subscribe")
async def create_subscriber_route(subscriber: Subscriber, db: Session = Depends(get_db)):
    try:
        # Check if the email is already subscribed
        existing_subscriber = db.query(Subscriber).filter(Subscriber.email == subscriber.email).first()
        if existing_subscriber:
            raise HTTPException(status_code=400, detail="Email is already subscribed")

        new_subscriber = create_subscriber(db, subscriber)
        db.commit()
        return {"message": "Subscriber created successfully", "subscriber_id": new_subscriber.id}
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create subscriber. {error}")

# Route to get subscriber by ID
@router.get("/subscriber/{subscriber_id}")
async def get_subscriber_route(subscriber_id: int, db: Session = Depends(get_db)):
    try:
        subscriber = get_subscriber(db, subscriber_id)
        if subscriber:
            return subscriber
        else:
            raise HTTPException(status_code=404, detail="Subscriber not found.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch subscriber. {error}")

# Route to delete subscriber by ID
@router.delete("/subscriber/{subscriber_id}")
async def delete_subscriber_route(subscriber_id: int, db: Session = Depends(get_db)):
    try:
        delete_subscriber(db, subscriber_id)
        db.commit()
        return {"message": "Subscriber deleted successfully"}
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete subscriber. {error}")