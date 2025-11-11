from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models.user_model import User
from app.database import get_session

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{email}")
def get_user(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    result = session.exec(statement).first()
    return result
