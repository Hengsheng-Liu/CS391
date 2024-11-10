from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EventDB(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    food_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String, nullable=False)
    rsvp_count = Column(Integer, nullable=False)
    servings = Column(Integer, nullable=False)
    expiration = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
