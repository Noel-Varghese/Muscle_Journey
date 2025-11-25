from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.utils.auth_utils import get_current_user
from app.models.comment_model import Comment
from app.models.comment_like_model import CommentLike
from app.models.user_model import User

router = APIRouter(prefix="/comments", tags=["Comment Likes"])


@router.post("/{comment_id}/like")
def like_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    existing = session.exec(
        select(CommentLike).where(
            CommentLike.comment_id == comment_id,
            CommentLike.user_id == user.id,
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already liked")

    like = CommentLike(comment_id=comment_id, user_id=user.id)
    session.add(like)
    session.commit()
    return {"message": "Comment liked!"}


@router.delete("/{comment_id}/like")
def unlike_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    like = session.exec(
        select(CommentLike).where(
            CommentLike.comment_id == comment_id,
            CommentLike.user_id == user.id,
        )
    ).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    session.delete(like)
    session.commit()
    return {"message": "Comment like removed"}
