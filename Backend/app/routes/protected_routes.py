from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.utils.auth_utils import get_current_user

router = APIRouter(tags=["Protected"])

@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Welcome back, {current_user.username}! You're authenticated.",
        "email": current_user.email,
        "bmi": current_user.bmi
    }
