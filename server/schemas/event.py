from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from schemas import user

class EventCreate(BaseModel):
    name: str
    description: str
    location: str
    rsvp_count: int
    expiration: datetime
    created_at: datetime
    host_id: int
    create_by: str
    allergies: Optional[List[str]] = []
    cuisine: Optional[List[str]] = []
    class Config:
        orm_mode = True

class EventResponse(BaseModel):
    id: int
    name: str
    description: str
    location: str
    rsvp_count: int
    expiration: datetime
    created_at: datetime
    host_id: int
    create_by: str
    participants: Optional[List[user.UserResponse]] = []
    allergies: Optional[List[str]] = []
    cuisine: Optional[List[str]] = []

    class Config:
        orm_mode = True