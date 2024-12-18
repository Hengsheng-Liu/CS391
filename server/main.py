from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import engine

from routers.user import router as user_router
from routers.event import router as event_router
from routers.rsvp import router as rsvp_router
from routers.subscriber import router as subscriber_router

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

# Include routers
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(event_router, prefix="/events", tags=["events"])
app.include_router(rsvp_router, prefix="/rsvp", tags=["rsvp"])
app.include_router(subscriber_router, prefix="/subscriber", tags=["subscriber"])

# Run the app
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)