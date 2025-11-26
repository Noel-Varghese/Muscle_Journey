# backend/app/models/post_model.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    image_url: Optional[str] = None
    media_type: Optional[str] = None
    # optional backref (user_model should define posts relationship)
    user: Optional["User"] = Relationship(back_populates="posts")
