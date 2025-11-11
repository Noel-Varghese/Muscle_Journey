from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.database import engine
from app.routes import user_routes, auth_routes, protected_routes

# 🚀 FastAPI instance
app = FastAPI(title="HealthBook API", version="1.0.0")

# 🌍 CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧱 Create DB tables
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# 🧭 Routers
app.include_router(user_routes.router)
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(protected_routes.router)

# 🏠 Root route
@app.get("/")
def root():
    return {"message": "HealthBook API is running successfully!"}
