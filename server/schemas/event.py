from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from schemas import user
class EventCreate(BaseModel):
    name: str
    food_type: str
    description: str
    location: str
    rsvp_count: int
    servings: int
    expiration: datetime
    created_at: datetime
    host_id: int
    create_by: str 
    class Config:
        orm_mode = True

class EventResponse(BaseModel):
    id: int
    name: str
    food_type: str
    description: str
    location: str
    rsvp_count: int
    servings: int
    expiration: datetime
    created_at: datetime
    host_id: int
    create_by: str
    participants: Optional[List[user.UserResponse]] = []

    class Config:
        orm_mode = True