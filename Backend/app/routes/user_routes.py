from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models.user_model import User
from app.database import get_session
from fastapi import UploadFile, File
from app.utils.auth_utils import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{email}")
def get_user(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    result = session.exec(statement).first()
    return result

@router.post("/avatar")
def update_avatar(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    try:
        upload_result = cloudinary.uploader.upload(file.file)
        url = upload_result.get("secure_url")

        user.avatar_url = url
        session.add(user)
        session.commit()

        return {"avatar_url": url}

    except Exception as e:
        return {"error": str(e)}