from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.database import engine
from app.routes import user_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 This creates tables automatically if they don't exist
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(user_routes.router)

@app.get("/")
def root():
    return {"message": "HealthBook API is running!"}
