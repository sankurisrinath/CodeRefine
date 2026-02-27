from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.user import User
from models.project import Project
from models.analysis_history import AnalysisHistory
from utils.auth import get_current_active_user, get_password_hash, verify_password
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class ProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: Optional[datetime]
    projects_count: int = 0
    total_analyses: int = 0

    class Config:
        from_attributes = True


async def _build_profile_response(user: User, db: AsyncSession) -> dict:
    projects_result = await db.execute(
        select(func.count()).where(
            Project.user_id == user.id, Project.is_active == True
        )
    )
    projects_count = projects_result.scalar() or 0

    analyses_result = await db.execute(
        select(func.count()).where(AnalysisHistory.user_id == user.id)
    )
    total_analyses = analyses_result.scalar() or 0

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at,
        "projects_count": projects_count,
        "total_analyses": total_analyses,
    }


@router.get("/", response_model=ProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await _build_profile_response(current_user, db)


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    for key, value in profile_data.model_dump(exclude_none=True).items():
        setattr(current_user, key, value)
    await db.commit()
    await db.refresh(current_user)
    return await _build_profile_response(current_user, db)


@router.post("/change-password", status_code=204)
async def change_password(
    password_data: PasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.hashed_password = get_password_hash(password_data.new_password)
    await db.commit()
