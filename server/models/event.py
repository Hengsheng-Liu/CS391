from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class EventDB(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    title = Column(String, nullable=False)
    type_of_food = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)