from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import engine
from models.user import Base as UserBase
from models.event import Base as EventBase
from routers.user import router as user_router
from routers.event import router as event_router

# Initialize FastAPI app
app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
UserBase.metadata.create_all(bind=engine)
EventBase.metadata.create_all(bind=engine)

# Include routers
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(event_router, prefix="/events", tags=["events"])

# Run the app
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)