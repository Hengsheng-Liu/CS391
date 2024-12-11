from model import Subscriber
from schemas.subscriber import Subscriber as SubscriberSchema
from sqlalchemy.orm import Session

#create subscriber
def create_subscriber(db: Session, subscriber: SubscriberSchema):
    db_subscriber = Subscriber(email=subscriber.email)
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

#get subscriber by ID
def get_subscriber(db: Session, subscriber_id: int):
    return db.query(Subscriber).filter(Subscriber.id == subscriber_id).first()

#delete subscriber by ID
def delete_subscriber(db: Session, subscriber_id: int):
    db.query(Subscriber).filter(Subscriber.id == subscriber_id).delete()
    db.commit()
    return {"message": "Subscriber deleted successfully."}