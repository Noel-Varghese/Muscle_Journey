from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime

from app.models.user_model import User
from app.models.token_model import RefreshToken
from app.database import get_session
from app.utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

router = APIRouter(tags=["Auth"])

# --- Schemas ---
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    gender: str
    height: float
    weight: float
    age: int

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

# --- Register ---
@router.post("/register")
def register_user(user_data: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    bmi = round(user_data.weight / ((user_data.height / 100) ** 2), 2)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        gender=user_data.gender,
        height=user_data.height,
        weight=user_data.weight,
        age=user_data.age,
        bmi=bmi,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered successfully!"}

# --- Login ---
@router.post("/login")
def login_user(form_data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.email)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)

    # store refresh token
    payload = decode_token(refresh_token)
    exp_ts = datetime.utcfromtimestamp(payload["exp"])
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        created_at=datetime.utcnow(),
        expires_at=exp_ts,
        revoked=False
    )
    session.add(db_token)
    session.commit()
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "message": "Login successful!"
    }

# --- Refresh ---
@router.post("/refresh")
def refresh_token_endpoint(req: RefreshRequest, session: Session = Depends(get_session)):
    payload = decode_token(req.refresh_token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    db_token = session.exec(select(RefreshToken).where(RefreshToken.token == req.refresh_token)).first()
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token expired or revoked")

    new_access = create_access_token(subject=email)
    return {"access_token": new_access, "token_type": "bearer"}

# --- Logout ---
@router.post("/logout")
def logout(req: RefreshRequest, session: Session = Depends(get_session)):
    db_token = session.exec(select(RefreshToken).where(RefreshToken.token == req.refresh_token)).first()
    if not db_token:
        return {"message": "Token already invalid or not found."}
    db_token.revoked = True
    session.add(db_token)
    session.commit()
    return {"message": "Logout successful — refresh token revoked."}
