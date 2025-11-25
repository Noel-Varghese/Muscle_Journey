from sqlmodel import SQLModel, Field
from typing import Optional


class CommentLike(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    comment_id: int = Field(foreign_key="comment.id")
    user_id: int = Field(foreign_key="user.id")
