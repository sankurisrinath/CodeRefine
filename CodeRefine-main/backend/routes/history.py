from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.analysis_history import AnalysisHistory
from models.user import User
from utils.auth import get_current_active_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/history", tags=["history"])


class AnalysisHistoryResponse(BaseModel):
    id: int
    language: str
    mode: str
    code_snippet: str
    instruction: Optional[str]
    optimized_code: Optional[str]
    explanation: Optional[str]
    confidence_score: Optional[float]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[AnalysisHistoryResponse])
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(AnalysisHistory)
        .where(AnalysisHistory.user_id == current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{analysis_id}", response_model=AnalysisHistoryResponse)
async def get_analysis(
    analysis_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    from fastapi import HTTPException
    result = await db.execute(
        select(AnalysisHistory).where(
            AnalysisHistory.id == analysis_id,
            AnalysisHistory.user_id == current_user.id,
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
