from pydantic import BaseModel
from datetime import datetime

class EventCreate(BaseModel):
    name: str
    date: datetime
    title: str
    type_of_food: str
    description: str

class EventResponse(BaseModel):
    id: int
    name: str
    date: datetime
    title: str
    type_of_food: str
    description: str
    created_at: datetime

    class Config:
        orm_mode = True