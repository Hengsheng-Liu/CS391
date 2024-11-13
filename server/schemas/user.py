from pydantic import BaseModel
from datetime import datetime

class UserRequest(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str