from pydantic import BaseModel

class Rsvp(BaseModel):
    event_id: int
    user_id: int
    class Config:
        orm_mode = True
