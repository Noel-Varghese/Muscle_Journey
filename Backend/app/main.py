from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.database import engine
from app.routes import user_routes, auth_routes

# 🚀 Initialize FastAPI app
app = FastAPI(title="HealthBook API", version="1.0.0")

# 🌐 CORS setup (allows your React frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can later replace "*" with your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧱 Create all database tables on startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# 🧭 Include route files
app.include_router(user_routes.router)
app.include_router(auth_routes.router, prefix="/auth")

# 🏠 Root endpoint
@app.get("/")
def root():
    return {"message": "HealthBook API is running successfully!"}
