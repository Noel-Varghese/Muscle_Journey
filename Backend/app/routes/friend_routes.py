from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, or_, not_
from typing import List

from app.database import get_session
from app.models.user_model import User
from app.models.friendship_model import Friendship
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/friends", tags=["Friends"])


# ---------- HELPERS ----------

def _friendship_exists(session: Session, user_id: int, other_id: int) -> Friendship | None:
    """Return existing Friendship row between two users in any direction."""
    return session.exec(
        select(Friendship).where(
            or_(
                (Friendship.requester_id == user_id) & (Friendship.receiver_id == other_id),
                (Friendship.requester_id == other_id) & (Friendship.receiver_id == user_id),
            )
        )
    ).first()


# ---------- SUGGESTIONS ----------

@router.get("/suggestions")
def get_friend_suggestions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    my_links: List[Friendship] = session.exec(
        select(Friendship).where(
            or_(
                Friendship.requester_id == current_user.id,
                Friendship.receiver_id == current_user.id,
            )
        )
    ).all()

    excluded_ids = {current_user.id}
    for f in my_links:
        excluded_ids.add(f.requester_id)
        excluded_ids.add(f.receiver_id)

    suggestions = session.exec(
        select(User).where(not_(User.id.in_(excluded_ids)))
    ).all()

    return [
        {
            "id": u.id,
            "username": u.username,
            "avatar_url": getattr(u, "avatar_url", None),
            "bmi": getattr(u, "bmi", None),
        }
        for u in suggestions
    ]


# ---------- SEND FRIEND REQUEST (FOLLOW) ----------

@router.post("/add/{target_id}")
def send_friend_request(
    target_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if target_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot add yourself")

    target = session.get(User, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = _friendship_exists(session, current_user.id, target_id)
    if existing:
        if existing.status == "accepted":
            raise HTTPException(status_code=400, detail="You are already friends")
        else:
            raise HTTPException(status_code=400, detail="Friend request already exists")

    friendship = Friendship(
        requester_id=current_user.id,
        receiver_id=target_id,
        status="pending",
    )
    session.add(friendship)
    session.commit()
    session.refresh(friendship)

    return {"message": "Friend request sent", "friendship_id": friendship.id}


# ---------- INCOMING REQUESTS ----------

@router.get("/requests")
def get_incoming_requests(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    rows = session.exec(
        select(Friendship, User)
        .join(User, User.id == Friendship.requester_id)
        .where(
            Friendship.receiver_id == current_user.id,
            Friendship.status == "pending",
        )
    ).all()

    return [
        {
            "friendship_id": f.id,
            "from_user_id": u.id,
            "from_username": u.username,
            "avatar_url": getattr(u, "avatar_url", None),
        }
        for (f, u) in rows
    ]


# ---------- FRIEND LIST (ACCEPTED) ----------

@router.get("/list")
def get_friends(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    links: List[Friendship] = session.exec(
        select(Friendship).where(
            Friendship.status == "accepted",
            or_(
                Friendship.requester_id == current_user.id,
                Friendship.receiver_id == current_user.id,
            ),
        )
    ).all()

    friends: list[dict] = []

    for f in links:
        friend_id = f.receiver_id if f.requester_id == current_user.id else f.requester_id
        u = session.get(User, friend_id)
        if not u:
            continue
        friends.append(
            {
                "id": u.id,
                "username": u.username,
                "avatar_url": getattr(u, "avatar_url", None),
                "bmi": getattr(u, "bmi", None),
            }
        )

    return friends


# ---------- ACCEPT REQUEST ----------

@router.post("/accept/{friendship_id}")
def accept_request(
    friendship_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    f = session.get(Friendship, friendship_id)
    if not f:
        raise HTTPException(status_code=404, detail="Request not found")

    if f.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    f.status = "accepted"
    session.add(f)
    session.commit()
    session.refresh(f)

    return {"message": "Friend request accepted"}


# ---------- REJECT REQUEST ----------

@router.delete("/reject/{friendship_id}")
def reject_request(
    friendship_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    f = session.get(Friendship, friendship_id)
    if not f:
        raise HTTPException(status_code=404, detail="Request not found")

    if f.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(f)
    session.commit()
    return {"message": "Friend request rejected"}


# ✅ ✅ ✅ NEW: UNFRIEND / UNFOLLOW ROUTE (NO STRUCTURE CHANGE)
@router.delete("/remove/{target_id}")
def remove_friend(
    target_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    f = _friendship_exists(session, current_user.id, target_id)

    if not f:
        raise HTTPException(status_code=404, detail="Friendship not found")

    session.delete(f)
    session.commit()

    return {"message": "Friend removed"}
