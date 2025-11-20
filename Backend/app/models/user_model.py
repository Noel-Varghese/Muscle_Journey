from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

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

    avatar_url: Optional[str] = None  
    bio: Optional[str] = None
    posts: List["Post"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
