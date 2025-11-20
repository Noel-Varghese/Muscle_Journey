# backend/app/routes/post_routes.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
from typing import List
import cloudinary.uploader

from app.models.post_model import Post
from app.models.user_model import User
from app.models.like_model import Like
from app.models.comment_model import Comment
from app.database import get_session
from app.utils.auth_utils import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/posts", tags=["Posts"])


# ---------- Post Create (text-only) ----------
class PostCreate(BaseModel):
    content: str

@router.post("/", response_model=Post)
def create_post(post_data: PostCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    post = Post(content=post_data.content, user_id=user.id)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


# ---------- Feed ----------
@router.get("/feed", response_model=List[Post])
def get_feed(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    statement = select(Post).order_by(Post.created_at.desc())
    feed = session.exec(statement).all()
    return feed


# ---------- Single Post ----------
@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ---------- Delete Post ----------
@router.delete("/{post_id}")
def delete_post(post_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    post = session.get(Post, post_id)
    if not post or post.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    session.delete(post)
    session.commit()
    return {"message": "Post deleted successfully"}


# ---------- Likes ----------
@router.post("/{post_id}/like")
def like_post(post_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    existing_like = session.exec(
        select(Like).where(Like.post_id == post_id, Like.user_id == user.id)
    ).first()

    if existing_like:
        raise HTTPException(status_code=400, detail="Post is already liked")

    like = Like(post_id=post_id, user_id=user.id)
    session.add(like)
    session.commit()
    return {"message": "Post liked!"}


@router.delete("/{post_id}/like")
def unlike_post(post_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    like = session.exec(
        select(Like).where(Like.post_id == post_id, Like.user_id == user.id)
    ).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    session.delete(like)
    session.commit()
    return {"message": "Like removed"}


@router.get("/{post_id}/likes/count")
def get_post_likes(post_id: int, session: Session = Depends(get_session)):
    likes = session.exec(select(Like).where(Like.post_id == post_id)).all()
    return {"likes_count": len(likes)}


# ---------- Comments ----------
class CommentCreate(BaseModel):
    content: str

@router.post("/{post_id}/comment")
def add_comment(post_id: int, comment_data: CommentCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    comment = Comment(content=comment_data.content, user_id=user.id, post_id=post_id)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.get("/{post_id}/comments")
def get_comments(post_id: int, session: Session = Depends(get_session)):
    comments = session.exec(select(Comment).where(Comment.post_id == post_id)).all()
    return comments


@router.delete("/comment/{comment_id}")
def delete_comment(comment_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(comment)
    session.commit()
    return {"message": "Comment deleted"}


# ---------- Create Post WITH optional image ----------
@router.post("/create", response_model=Post)
async def create_post_with_image(
    content: str = Form(...),
    file: UploadFile = File(None),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    image_url = None

    # Upload image to Cloudinary if provided
    if file:
        try:
            upload = cloudinary.uploader.upload(file.file)
            image_url = upload.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    post = Post(content=content, user_id=user.id, image_url=image_url)
    session.add(post)
    session.commit()
    session.refresh(post)

    return post
