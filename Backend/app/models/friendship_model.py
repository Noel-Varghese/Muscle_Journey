from sqlmodel import SQLModel, Field
from typing import Optional

class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    requester_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    status: str = Field(default="pending")  # "pending" or "accepted"
