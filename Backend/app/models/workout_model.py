from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Workout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    exercise: str
    sets: int
    reps: int
    weight: Optional[float] = None

    # use local time instead of UTC so the date matches your actual day
    created_at: datetime = Field(default_factory=datetime.now)
