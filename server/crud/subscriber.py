from model import SubscriberDB
from schemas.subscriber import Subscriber
from sqlalchemy.orm import Session

#create subscriber
def create_subscriber(db: Session, subscriber: Subscriber):
    db_subscriber = SubscriberDB(**subscriber.dict())
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

#get subscriber by ID
def get_subscriber(db: Session, subscriber_id: int):
    return db.query(SubscriberDB).filter(SubscriberDB.id == subscriber_id)

#delete subscriber by ID
def delete_subscriber(db: Session, subscriber_id: int):
    db.query(SubscriberDB).filter(SubscriberDB.id == subscriber_id).delete()
    db.commit()
    return {"message": "Subscriber deleted successfully."}
