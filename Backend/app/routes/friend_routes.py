from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.utils.auth_utils import get_current_user
from app.models.user_model import User
from app.models.friendship_model import Friendship

router = APIRouter(prefix="/friends", tags=["Friends"])

# ------------------ SEND REQUEST ------------------
@router.post("/request/{user_id}")
def send_request(
    user_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(get_current_user)
):
    # cannot friend yourself
    if user_id == current.id:
        raise HTTPException(status_code=400, detail="You cannot friend yourself")

    # check if already friends or pending
    existing = session.exec(
        select(Friendship).where(
            ((Friendship.requester_id == current.id) & (Friendship.receiver_id == user_id)) |
            ((Friendship.receiver_id == current.id) & (Friendship.requester_id == user_id))
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Request already exists")

    req = Friendship(requester_id=current.id, receiver_id=user_id)
    session.add(req)
    session.commit()
    return {"message": "Friend request sent!"}


# ------------------ ACCEPT REQUEST ------------------
@router.post("/accept/{user_id}")
def accept_request(
    user_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(get_current_user)
):
    request = session.exec(
        select(Friendship).where(
            Friendship.requester_id == user_id,
            Friendship.receiver_id == current.id,
            Friendship.status == "pending"
        )
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="No pending request")

    request.status = "accepted"
    session.add(request)
    session.commit()

    return {"message": "Friend request accepted"}


# ------------------ LIST FRIENDS ------------------
@router.get("/list")
def list_friends(
    session: Session = Depends(get_session),
    current: User = Depends(get_current_user)
):
    friends = session.exec(
        select(Friendship).where(
            ((Friendship.requester_id == current.id) | (Friendship.receiver_id == current.id)),
            Friendship.status == "accepted"
        )
    ).all()

    return friends


# ------------------ LIST PENDING REQUESTS ------------------
@router.get("/pending")
def pending_requests(
    session: Session = Depends(get_session),
    current: User = Depends(get_current_user)
):
    pending = session.exec(
        select(Friendship).where(
            Friendship.receiver_id == current.id,
            Friendship.status == "pending"
        )
    ).all()

    return pending


# ------------------ REMOVE FRIEND ------------------
@router.delete("/{user_id}")
def remove_friend(
    user_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(get_current_user)
):
    friendship = session.exec(
        select(Friendship).where(
            ((Friendship.requester_id == current.id) & (Friendship.receiver_id == user_id)) |
            ((Friendship.receiver_id == current.id) & (Friendship.requester_id == user_id)),
            Friendship.status == "accepted"
        )
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    session.delete(friendship)
    session.commit()

    return {"message": "Friend removed"}
