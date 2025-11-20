from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict
from app.database import get_session
from app.models.follow_model import Follow
from app.models.user_model import User
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/friends", tags=["Friends"])

# follow a user (current_user -> target_user)
@router.post("/{target_user_id}/follow")
def follow_user(target_user_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    if user.id == target_user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    # check exists
    exists = session.exec(
        select(Follow).where(Follow.follower_id == user.id, Follow.following_id == target_user_id)
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already following")

    # ensure target exists
    target = session.get(User, target_user_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")

    follow = Follow(follower_id=user.id, following_id=target_user_id)
    session.add(follow)
    session.commit()
    session.refresh(follow)
    return {"message": "Followed", "follow_id": follow.id}

# unfollow
@router.delete("/{target_user_id}/unfollow")
def unfollow_user(target_user_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    rel = session.exec(
        select(Follow).where(Follow.follower_id == user.id, Follow.following_id == target_user_id)
    ).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Follow relation not found")
    session.delete(rel)
    session.commit()
    return {"message": "Unfollowed"}

# list who current user is following
@router.get("/me/following", response_model=List[Dict])
def my_following(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    rows = session.exec(select(Follow).where(Follow.follower_id == user.id)).all()
    ids = [r.following_id for r in rows]
    if not ids:
        return []
    users = session.exec(select(User).where(User.id.in_(ids))).all()
    # return minimal public profile
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

# list who follows current user
@router.get("/me/followers", response_model=List[Dict])
def my_followers(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    rows = session.exec(select(Follow).where(Follow.following_id == user.id)).all()
    ids = [r.follower_id for r in rows]
    if not ids:
        return []
    users = session.exec(select(User).where(User.id.in_(ids))).all()
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

# list following for arbitrary user (public)
@router.get("/{user_id}/following", response_model=List[Dict])
def get_following(user_id: int, session: Session = Depends(get_session)):
    rows = session.exec(select(Follow).where(Follow.follower_id == user_id)).all()
    ids = [r.following_id for r in rows]
    users = session.exec(select(User).where(User.id.in_(ids))).all() if ids else []
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

# list followers for arbitrary user (public)
@router.get("/{user_id}/followers", response_model=List[Dict])
def get_followers(user_id: int, session: Session = Depends(get_session)):
    rows = session.exec(select(Follow).where(Follow.following_id == user_id)).all()
    ids = [r.follower_id for r in rows]
    users = session.exec(select(User).where(User.id.in_(ids))).all() if ids else []
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

# check if current user follows given user
@router.get("/{target_user_id}/is_following")
def is_following(target_user_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    rel = session.exec(select(Follow).where(Follow.follower_id == user.id, Follow.following_id == target_user_id)).first()
    return {"is_following": bool(rel)}

# suggestions: users you don't follow (simple)
@router.get("/me/suggestions", response_model=List[Dict])
def suggestions(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    # get ids current user follows
    following_rows = session.exec(select(Follow).where(Follow.follower_id == user.id)).all()
    following_ids = {r.following_id for r in following_rows}
    # include self to exclude
    following_ids.add(user.id)
    # pick some users not in following_ids
    candidates = session.exec(select(User).where(User.id.not_in(list(following_ids))).limit(20)).all()
    # return minimal
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in candidates]
