from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models.user_model import User
from app.database import get_session

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def create_user(user: User, session: Session = Depends(get_session)):
    user.bmi = round(user.weight / ((user.height / 100) ** 2), 2)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/{email}")
def get_user(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    result = session.exec(statement).first()
    return result
