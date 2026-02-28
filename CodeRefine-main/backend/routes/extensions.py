import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models.project import Project
from models.file import File
from models.user import User
from models.project_activity import ProjectActivity, ActionType
from utils.auth import get_current_active_user
from ai_extensions import rewrite, explain, testgen, debug, metrics, visualize, chat

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/extensions", tags=["extensions"])


# ── Request / Response models ──────────────────────────────────────────────────

class RewriteRequest(BaseModel):
    project_id: int
    file_id: int
    instruction: str


class ExplainRequest(BaseModel):
    project_id: int
    file_id: int


class GenerateTestsRequest(BaseModel):
    project_id: int
    file_id: int
    test_framework: Optional[str] = ""


class DebugRequest(BaseModel):
    project_id: int
    file_id: int
    error_message: str


class MetricsRequest(BaseModel):
    project_id: int
    file_id: int


class VisualizeRequest(BaseModel):
    project_id: int
    file_id: int


class ChatRequest(BaseModel):
    project_id: int
    file_id: int
    message: str
    conversation_history: Optional[List[dict]] = None


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _get_owned_project(project_id: int, current_user: User, db: AsyncSession) -> Project:
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


async def _get_file(project_id: int, file_id: int, db: AsyncSession) -> File:
    result = await db.execute(
        select(File).where(File.id == file_id, File.project_id == project_id)
    )
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    return db_file


async def _log_activity(
    db: AsyncSession,
    user_id: int,
    project_id: int,
    action_type: ActionType,
    file_name: str,
    file_id: Optional[int] = None,
) -> None:
    activity = ProjectActivity(
        user_id=user_id,
        project_id=project_id,
        file_id=file_id,
        action_type=action_type,
        file_name=file_name,
    )
    db.add(activity)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/rewrite")
async def rewrite_code(
    req: RewriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = rewrite.rewrite_code(db_file.content or "", db_file.language, req.instruction)
    except Exception as e:
        logger.error(f"Rewrite failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during rewrite")
    await _log_activity(db, current_user.id, req.project_id, ActionType.REWRITE_FILE, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, **result}


@router.post("/explain")
async def explain_code(
    req: ExplainRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = explain.explain_code(db_file.content or "", db_file.language)
    except Exception as e:
        logger.error(f"Explain failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during explanation")
    await _log_activity(db, current_user.id, req.project_id, ActionType.EXPLAIN_FILE, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, **result}


@router.post("/generate-tests")
async def generate_tests(
    req: GenerateTestsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = testgen.generate_tests(db_file.content or "", db_file.language, req.test_framework or "")
    except Exception as e:
        logger.error(f"Test generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during test generation")
    await _log_activity(db, current_user.id, req.project_id, ActionType.GENERATE_TEST, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, **result}


@router.post("/debug")
async def debug_code(
    req: DebugRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = debug.debug_code(db_file.content or "", db_file.language, req.error_message)
    except Exception as e:
        logger.error(f"Debug failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during debugging")
    await _log_activity(db, current_user.id, req.project_id, ActionType.DEBUG_FILE, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, **result}


@router.post("/metrics")
async def get_metrics(
    req: MetricsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = metrics.calculate_metrics(db_file.content or "", db_file.language)
    except Exception as e:
        logger.error(f"Metrics failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during metrics calculation")
    await _log_activity(db, current_user.id, req.project_id, ActionType.METRICS_RUN, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, "metrics": result}


@router.post("/visualize")
async def visualize_code(
    req: VisualizeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = visualize.visualize_code(db_file.content or "", db_file.language)
    except Exception as e:
        logger.error(f"Visualize failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during visualization")
    await _log_activity(db, current_user.id, req.project_id, ActionType.VISUALIZE_FILE, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, "visualization": result}


@router.post("/chat")
async def chat_with_code(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(req.project_id, current_user, db)
    db_file = await _get_file(req.project_id, req.file_id, db)
    try:
        result = chat.chat_about_code(
            db_file.content or "",
            db_file.language,
            db_file.name,
            req.message,
            req.conversation_history or [],
        )
    except Exception as e:
        logger.error(f"Chat failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI service error during chat")
    await _log_activity(db, current_user.id, req.project_id, ActionType.CHAT_USED, db_file.name, db_file.id)
    await db.commit()
    return {"success": True, **result}
