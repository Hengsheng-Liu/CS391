from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.subscriber import Subscriber as SubscriberSchema
from model import Subscriber as SubscriberDB
from crud.subscriber import create_subscriber, get_subscriber, delete_subscriber

router = APIRouter()

# Route to create a new subscriber
@router.post("/notification/subscribe", status_code=201)
async def create_subscriber_route(subscriber: SubscriberSchema, db: Session = Depends(get_db)):
    try:
        print(f"Received subscriber data: {subscriber}")  # Log the received data

        # Check if the email is already subscribed
        existing_subscriber = db.query(SubscriberDB).filter(SubscriberDB.email == subscriber.email).first()
        if existing_subscriber:
            raise HTTPException(status_code=400, detail="Email is already subscribed")

        # Create a new subscriber
        new_subscriber = create_subscriber(db, subscriber)
        db.commit()
        return {"message": "Subscriber created successfully", "subscriber_id": new_subscriber.id}
    except Exception as error:
        db.rollback()
        print(f"Error creating subscriber: {error}")  # Log the error
        raise HTTPException(status_code=500, detail=f"Failed to create subscriber. {error}")

# Route to delete a subscriber by email
@router.post("/unsubscribe", status_code=200)
async def delete_subscriber_route(subscriber: SubscriberSchema, db: Session = Depends(get_db)):
    try:
        print(f"Received unsubscribe request: {subscriber}")  # Log the received data

        # Delete the subscriber by email
        result = delete_subscriber(db, subscriber.email)
        if result["message"] == "Subscriber not found.":
            raise HTTPException(status_code=400, detail="Email is not subscribed")

        return result
    except Exception as error:
        db.rollback()
        print(f"Error unsubscribing: {error}")  # Log the error
        raise HTTPException(status_code=500, detail=f"Failed to unsubscribe. {error}")