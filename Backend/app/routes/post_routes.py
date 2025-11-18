from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.models.post_model import Post
from app.models.user_model import User
from app.database import get_session
from app.utils.auth_utils import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/posts", tags=["Posts"])

class PostCreate(BaseModel):
    content: str

@router.post("/", response_model=Post)
def create_post(post_data: PostCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    post = Post(content=post_data.content, user_id=user.id)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.get("/feed", response_model=List[Post])
def get_feed(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    statement = select(Post).order_by(Post.created_at.desc())
    feed = session.exec(statement).all()
    return feed


@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.delete("/{post_id}")
def delete_post(post_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    post = session.get(Post, post_id)
    if not post or post.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    session.delete(post)
    session.commit()
    return {"message": "Post deleted successfully"}
