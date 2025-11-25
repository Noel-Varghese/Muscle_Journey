from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader

from app.models.user_model import User
from app.database import get_session
from app.utils.auth_utils import get_current_user
from app.utils.cloudinary_config import cloud_name, api_key, api_secret

router = APIRouter(prefix="/users", tags=["Users"])

# Make sure Cloudinary is configured (safe to call multiple times)
cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True,
)

# ---------- SCHEMA FOR PROFILE UPDATE ----------
class ProfileUpdate(BaseModel):
    username: str
    bio: str
    height: float
    weight: float
    age: int


# ---------- GET USER BY ID (FOR FRIEND PROFILE) ----------
@router.get("/id/{user_id}")
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------- GET USER BY EMAIL (USED FOR LOGIN / ME) ----------
@router.get("/{email}")
def get_user(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/id/{user_id}")
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ---------- UPDATE AVATAR ----------
@router.post("/avatar")
def update_avatar(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        upload_result = cloudinary.uploader.upload(file.file)
        url = upload_result.get("secure_url")

        current_user.avatar_url = url
        session.add(current_user)
        session.commit()
        session.refresh(current_user)

        return {"avatar_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


# ---------- UPDATE PROFILE FIELDS ----------
@router.put("/update")
def update_profile(
    data: ProfileUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    current_user.username = data.username
    current_user.bio = data.bio
    current_user.height = data.height
    current_user.weight = data.weight
    current_user.age = data.age

    # Recalculate BMI
    current_user.bmi = round(
        current_user.weight / ((current_user.height / 100) ** 2), 2
    )

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {"message": "Profile updated!", "user": current_user}
