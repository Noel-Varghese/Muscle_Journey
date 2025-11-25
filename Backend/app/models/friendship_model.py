# backend/app/models/friendship_model.py
from typing import Optional
from sqlmodel import SQLModel, Field


class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # user who sent the request
    requester_id: int = Field(foreign_key="user.id")

    # user who received the request
    receiver_id: int = Field(foreign_key="user.id")

    # "pending" -> request sent, waiting
    # "accepted" -> both are friends
    status: str = Field(default="pending")
