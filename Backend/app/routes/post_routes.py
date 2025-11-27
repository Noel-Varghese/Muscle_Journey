from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
from typing import List
import cloudinary
import cloudinary.uploader
from pydantic import BaseModel

from app.models.post_model import Post
from app.models.user_model import User
from app.models.like_model import Like
from app.models.comment_model import Comment
from app.models.comment_like_model import CommentLike
from app.database import get_session
from app.utils.auth_utils import get_current_user
from app.utils.cloudinary_config import cloud_name, api_key, api_secret

router = APIRouter(prefix="/posts", tags=["Posts"])

# ✅ Cloudinary config
cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True
)

# ====== SCHEMAS ======
class PostCreate(BaseModel):
    content: str

class CommentCreate(BaseModel):
    content: str


# ====== CREATE TEXT POST ======
@router.post("/", response_model=Post)
def create_post(
    post_data: PostCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    post = Post(content=post_data.content, user_id=user.id)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


# ====== ✅ CREATE POST WITH IMAGE / GIF / VIDEO ======
@router.post("/create", response_model=Post)
async def create_post_with_media(
    content: str = Form(...),
    file: UploadFile | None = File(None),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    media_url = None
    media_type = None

    try:
        if file:
            uploaded = cloudinary.uploader.upload(
                file.file,
                resource_type="auto"   # ✅ allows image + gif + video
            )
            media_url = uploaded.get("secure_url")
            media_type = uploaded.get("resource_type")
            if media_url and media_url.endswith(".gif"):
                media_type = "gif"  # ✅ image | video
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading: {str(e)}")

    post = Post(
        content=content,
        user_id=user.id,
        image_url=media_url,
        media_type=media_type,   # ✅ REQUIRED FOR VIDEO SUPPORT
    )

    session.add(post)
    session.commit()
    session.refresh(post)
    return post


# ====== FEED ======
@router.get("/feed")
def get_feed(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    results = session.exec(
        select(Post, User).join(User, User.id == Post.user_id)
        .order_by(Post.created_at.desc())
    ).all()

    feed = []
    for post, u in results:
        likes = session.exec(select(Like).where(Like.post_id == post.id)).all()
        comments = session.exec(select(Comment).where(Comment.post_id == post.id)).all()

        feed.append({
            "id": post.id,
            "content": post.content,
            "user_id": post.user_id,
            "user": u.username,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "image_url": post.image_url,
            "media_type": post.media_type,   # ✅ frontend MUST receive this
            "created_at": post.created_at,
            "likes_count": len(likes),
            "comments_count": len(comments)
        })

    return feed


# ====== POSTS BY USER ======
@router.get("/user/{user_id}")
def get_user_posts(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    results = session.exec(
        select(Post, User)
        .join(User, User.id == Post.user_id)
        .where(Post.user_id == user_id)
        .order_by(Post.created_at.desc())
    ).all()

    posts = []
    for post, u in results:
        likes = session.exec(select(Like).where(Like.post_id == post.id)).all()
        comments = session.exec(select(Comment).where(Comment.post_id == post.id)).all()

        posts.append({
            "id": post.id,
            "content": post.content,
            "user_id": post.user_id,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "image_url": post.image_url,
            "media_type": post.media_type,  
            "created_at": post.created_at,
            "likes_count": len(likes),
            "comments_count": len(comments),
        })

    return posts


# ====== DELETE POST ======
@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(post)
    session.commit()
    return {"message": "Post deleted"}


# ====== POST LIKE ======
@router.get("/{post_id}/liked-by-me")
def liked_by_me(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    like = session.exec(
        select(Like).where(Like.post_id == post_id, Like.user_id == user.id)
    ).first()
    return {"liked": like is not None}


@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    exists = session.exec(
        select(Like).where(Like.post_id == post_id, Like.user_id == user.id)
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Already liked")

    like = Like(post_id=post_id, user_id=user.id)
    session.add(like)
    session.commit()
    return {"message": "Post liked"}


@router.delete("/{post_id}/like")
def unlike_post(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    exists = session.exec(
        select(Like).where(Like.post_id == post_id, Like.user_id == user.id)
    ).first()

    if not exists:
        raise HTTPException(status_code=404, detail="Like not found")

    session.delete(exists)
    session.commit()
    return {"message": "Like removed"}

@router.post("/{post_id}/comment")
def add_comment(
    post_id: int,
    comment_data: CommentCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    comment = Comment(
        content=comment_data.content,
        user_id=user.id,
        post_id=post_id
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.get("/{post_id}/comments")
def get_comments(
    post_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    comments = session.exec(
        select(Comment)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at)
    ).all()

    result = []
    for c in comments:
        likes = session.exec(
            select(CommentLike).where(CommentLike.comment_id == c.id)
        ).all()

        liked = session.exec(
            select(CommentLike).where(
                CommentLike.comment_id == c.id,
                CommentLike.user_id == user.id
            )
        ).first()

        result.append({
            "id": c.id,
            "content": c.content,
            "user_id": c.user_id,
            "created_at": c.created_at,
            "likes_count": len(likes),
            "liked_by_me": liked is not None
        })

    return result


@router.delete("/comment/{comment_id}")
def delete_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(comment)
    session.commit()
    return {"message": "Comment deleted"}


# ====== COMMENT LIKE ======
@router.post("/comments/{comment_id}/like")
def like_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    exists = session.exec(
        select(CommentLike).where(
            CommentLike.comment_id == comment_id,
            CommentLike.user_id == user.id
        )
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Already liked")

    like = CommentLike(comment_id=comment_id, user_id=user.id)
    session.add(like)
    session.commit()
    return {"message": "Comment liked"}


@router.delete("/comments/{comment_id}/like")
def unlike_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    exists = session.exec(
        select(CommentLike).where(
            CommentLike.comment_id == comment_id,
            CommentLike.user_id == user.id
        )
    ).first()

    if not exists:
        raise HTTPException(status_code=404, detail="Like not found")

    session.delete(exists)
    session.commit()
    return {"message": "Like removed"}
