from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from pydantic import BaseModel
import cloudinary.uploader
from app.utils.cloudinary_config import cloudinary
from app.models.user_model import User
from app.database import get_session
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


# ------------------------------------
# PROFILE UPDATE SCHEMA
# ------------------------------------
class ProfileUpdate(BaseModel):
    username: str
    bio: str
    height: float
    weight: float
    age: int


# ------------------------------------
# GET USER BY EMAIL
# ------------------------------------
@router.get("/{email}")
def get_user(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ------------------------------------
# UPDATE AVATAR
# ------------------------------------
@router.post("/avatar")
def update_avatar(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    try:
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(file.file)
        url = upload_result.get("secure_url")

        # Save on DB
        user.avatar_url = url
        session.add(user)
        session.commit()
        session.refresh(user)

        return {"message": "Avatar updated", "user": user}

    except Exception as e:
        print("CLOUDINARY ERROR:", e)  # 🔥 see real problem
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------
# UPDATE PROFILE INFO
# ------------------------------------
@router.put("/update")
def update_profile(
    data: ProfileUpdate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    user.username = data.username
    user.bio = data.bio
    user.height = data.height
    user.weight = data.weight
    user.age = data.age
    user.bmi = round(user.weight / ((user.height / 100) ** 2), 2)

    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "Profile updated!", "user": user}
