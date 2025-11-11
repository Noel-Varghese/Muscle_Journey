from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.user_model import User
from app.database import get_session
from app.utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user
from pydantic import BaseModel

router = APIRouter(tags=["Auth"])

# 📦 Request schemas
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


# 🧍 Register
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


# 🔑 Login
@router.post("/login")
def login_user(form_data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.email)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful!"
    }

@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint — frontend should delete JWT.
    """
    return {
        "message": f"User {current_user.username} logged out successfully.",
        "note": "Please delete the token on the client side to complete logout."
    }
