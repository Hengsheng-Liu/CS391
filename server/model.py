from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Sequence, ARRAY
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

# User Model
class UserDB(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)



# Event Model
class EventDB(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String, nullable=False)
    rsvp_count = Column(Integer, nullable=False)
    expiration = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    host_id = Column(Integer, nullable=False)
    create_by = Column(String, nullable=False)
    allergies = Column(ARRAY(String), nullable=True)  # Added allergies as ARRAY
    location = Column(String, nullable=False)  
    cuisine = Column(ARRAY(String), nullable=True)  # Added cuisine as ARRAY



# RSVP Model
class RsvpDB(Base):
    __tablename__ = 'rsvp'
    id = Column(Integer, Sequence('rsvp_id_seq'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id', ondelete='CASCADE'), nullable=False)



engine = create_engine("postgresql://p_user:p_password@localhost:5432/cs391")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
