from pydantic import BaseModel, EmailStr

class Subscriber(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True