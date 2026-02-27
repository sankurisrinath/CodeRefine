import io
import os
import re
import zipfile
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.project import Project
from models.file import File
from models.user import User
from models.project_activity import ProjectActivity, ActionType
from utils.auth import get_current_active_user
from pydantic import BaseModel
from typing import List,Optional
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["files"])

ALLOWED_EXTENSIONS = {".py", ".js", ".java", ".cpp", ".c", ".txt"}
LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".txt": "text",
}


class FileCreate(BaseModel):
    name: str
    language: str
    content: str = ""


class FileUpdate(BaseModel):
    content: str
    name: Optional[str] = None
    language: Optional[str] = None


class FileResponse(BaseModel):
    id: int
    name: str
    language: str
    content: str
    source: str
    project_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


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


@router.get("/{project_id}/history")
async def get_project_history(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(ProjectActivity)
        .where(
            ProjectActivity.project_id == project_id,
            ProjectActivity.user_id == current_user.id,
        )
        .order_by(ProjectActivity.timestamp.desc())
    )
    activities = result.scalars().all()
    return {
        "success": True,
        "activities": [
            {
                "id": a.id,
                "actionType": a.action_type.value,
                "fileName": a.file_name,
                "timestamp": a.timestamp.isoformat() if a.timestamp else None,
            }
            for a in activities
        ],
    }


@router.get("/{project_id}/files", response_model=List[FileResponse])
async def list_files(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(File).where(File.project_id == project_id).order_by(File.created_at.asc())
    )
    return result.scalars().all()


@router.post("/{project_id}/create-file", response_model=FileResponse, status_code=201)
async def create_file(
    project_id: int,
    file_data: FileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    new_file = File(
        project_id=project_id,
        name=file_data.name,
        language=file_data.language,
        content=file_data.content,
        source="internal",
    )
    db.add(new_file)
    await db.flush()
    await _log_activity(db, current_user.id, project_id, ActionType.CREATE_FILE, new_file.name, new_file.id)
    await db.commit()
    await db.refresh(new_file)
    return new_file


@router.post("/{project_id}/upload-file", response_model=FileResponse, status_code=201)
async def upload_file(
    project_id: int,
    file: UploadFile = FastAPIFile(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    content_bytes = await file.read()
    try:
        content = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be valid UTF-8 text")

    language = LANGUAGE_MAP.get(ext, "text")
    new_file = File(
        project_id=project_id,
        name=file.filename,
        language=language,
        content=content,
        source="external",
    )
    db.add(new_file)
    await db.flush()
    await _log_activity(db, current_user.id, project_id, ActionType.UPLOAD_FILE, new_file.name, new_file.id)
    await db.commit()
    await db.refresh(new_file)
    return new_file


@router.put("/{project_id}/files/{file_id}", response_model=FileResponse)
async def save_file(
    project_id: int,
    file_id: int,
    file_data: FileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(File).where(File.id == file_id, File.project_id == project_id)
    )
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    db_file.content = file_data.content
    if file_data.name is not None:
        db_file.name = file_data.name
    if file_data.language is not None:
        db_file.language = file_data.language
    await _log_activity(db, current_user.id, project_id, ActionType.EDIT_FILE, db_file.name, db_file.id)
    await db.commit()
    await db.refresh(db_file)
    return db_file


@router.delete("/{project_id}/files/{file_id}", status_code=204)
async def delete_file(
    project_id: int,
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(File).where(File.id == file_id, File.project_id == project_id)
    )
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    await db.delete(db_file)
    await db.commit()


@router.get("/{project_id}/files/{file_id}/download")
async def download_file(
    project_id: int,
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(File).where(File.id == file_id, File.project_id == project_id)
    )
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    content_bytes = (db_file.content or "").encode("utf-8")
    return StreamingResponse(
        io.BytesIO(content_bytes),
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{db_file.name}"'},
    )


@router.get("/{project_id}/export-zip")
async def export_zip(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project = await _get_owned_project(project_id, current_user, db)
    result = await db.execute(
        select(File).where(File.project_id == project_id).order_by(File.created_at.asc())
    )
    files = result.scalars().all()

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.writestr(f.name, f.content or "")
    zip_buffer.seek(0)

    safe_name = re.sub(r"[^a-zA-Z0-9\-_]", "_", project.name)[:64] or "project"
    for f in files:
        await _log_activity(db, current_user.id, project_id, ActionType.EXPORT_FILE, f.name, f.id)
    await db.commit()
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{safe_name}.zip"'},
    )
