from sqlalchemy.orm import Session
from model import Subscriber
from schemas.subscriber import Subscriber as SubscriberSchema

# Create subscriber
def create_subscriber(db: Session, subscriber: SubscriberSchema):
    db_subscriber = Subscriber(email=subscriber.email)
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

# Get subscriber by ID
def get_subscriber(db: Session, subscriber_id: int):
    return db.query(Subscriber).filter(Subscriber.id == subscriber_id).first()

# Delete subscriber by email
def delete_subscriber(db: Session, email: str):
    subscriber = db.query(Subscriber).filter(Subscriber.email == email).first()
    if subscriber:
        db.delete(subscriber)
        db.commit()
        return {"message": "Subscriber deleted successfully."}
    else:
        return {"message": "Subscriber not found."}