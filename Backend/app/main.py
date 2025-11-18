from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.database import engine
from app.routes import user_routes, auth_routes, protected_routes
from app.routes import post_routes


app = FastAPI(title="HealthBook API", version="2.0.0")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB init ---
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# --- Routes ---
app.include_router(user_routes.router)
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(protected_routes.router)
app.include_router(post_routes.router)

@app.get("/")
def root():
    return {"message": "HealthBook API running with JWT refresh support!"}
