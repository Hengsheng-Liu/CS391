from pydantic import BaseModel
from datetime import datetime

class EventCreate(BaseModel):
    name: str
    date: datetime
    title: str
    food_type: str
    description: str

class EventResponse(BaseModel):
    id: int
    name: str
    date: datetime
    title: str
    food_type: str
    description: str
    created_at: datetime

    class Config:
        orm_mode = True