# backend/app/models/workout_model.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date


class Workout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    exercise: str
    sets: int
    reps: int
    weight: Optional[float] = None

    # ✅ FIX: DATE ONLY (NO TIMEZONE BUG EVER AGAIN)
    workout_date: date = Field(default_factory=date.today)
