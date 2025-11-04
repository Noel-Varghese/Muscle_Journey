from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.models.user_model import User
from app.database import get_session
from app.utils.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register_user(user_data: dict, session: Session = Depends(get_session)):
    # Check for existing user
    existing = session.exec(select(User).where(User.email == user_data["email"])).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # Truncate password to avoid bcrypt length issue
    password = user_data["password"][:72]

    # Calculate BMI safely
    try:
        bmi = round(user_data["weight"] / ((user_data["height"] / 100) ** 2), 2)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid height or weight")

    # Create new user
    user = User(
        username=user_data["username"],
        email=user_data["email"],
        password_hash=hash_password(password),
        gender=user_data["gender"],
        height=user_data["height"],
        weight=user_data["weight"],
        age=user_data["age"],
        bmi=bmi,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "User registered successfully!"}


@router.post("/login")
def login_user(form_data: dict, session: Session = Depends(get_session)):
    email = form_data["email"]
    password = form_data["password"][:72]  # truncate here too, just in case

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
