from pydantic import BaseModel, EmailStr
from typing import Optional

class Subscriber(BaseModel):
    id: Optional[int] =None
    email: EmailStr

    class Config:
        from_attributes = True