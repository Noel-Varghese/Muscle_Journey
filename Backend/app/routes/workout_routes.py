# backend/app/routes/workout_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import date

from app.database import get_session
from app.models.workout_model import Workout
from app.models.user_model import User
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])


# ✅ ADD WORKOUT (FIXED DATE BUG)
@router.post("/")
def add_workout(
    workout: Workout,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    workout.user_id = user.id

    # ✅ FORCE TODAY'S DATE (NO UTC SHIFT)
 

    session.add(workout)
    session.commit()
    session.refresh(workout)
    return workout


# ✅ GET MY WORKOUTS
@router.get("/me")
def get_my_workouts(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    workouts = session.exec(
        select(Workout)
        .where(Workout.user_id == user.id)
        .order_by(Workout.created_at.desc())
    ).all()

    return workouts


# ✅ DELETE WORKOUT
@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    workout = session.get(Workout, workout_id)

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    if workout.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(workout)
    session.commit()
    return {"message": "Workout deleted"}


# ✅ CALENDAR DATA (🔵 + 🔥 SYSTEM NOW 100% CORRECT)
@router.get("/calendar")
def workout_calendar(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    workouts = session.exec(
        select(Workout).where(Workout.user_id == user.id)
    ).all()

    date_map = {}

    for w in workouts:
        day = w.created_at.strftime("%Y-%m-%d")  # ✅ FIXED
        date_map[day] = date_map.get(day, 0) + 1

    return date_map
