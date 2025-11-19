from sqlmodel import SQLModel, Field
from typing import Optional
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from app.models.post_model import Post


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password_hash: str
    gender: str
    height: float
    weight: float
    age: int
    bmi: float
    posts: List["Post"] = Relationship(back_populates="user")
