from pydantic import BaseModel

class Subscriber(BaseModel):
    user_id : int
    email: str
    class Config:
        orm_mode = True