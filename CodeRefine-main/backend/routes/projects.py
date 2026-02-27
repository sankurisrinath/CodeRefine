from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.project import Project
from models.file import File
from models.user import User
from utils.auth import get_current_active_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["projects"])


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    repository_url: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    language: Optional[str]
    repository_url: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    files_count: int = 0

    class Config:
        from_attributes = True


async def _project_response(project: Project, db: AsyncSession) -> dict:
    count_result = await db.execute(
        select(func.count()).where(File.project_id == project.id)
    )
    files_count = count_result.scalar() or 0
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "language": project.language,
        "repository_url": project.repository_url,
        "is_active": project.is_active,
        "created_at": project.created_at,
        "files_count": files_count,
    }


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(Project)
        .where(Project.user_id == current_user.id, Project.is_active == True)
        .order_by(Project.created_at.desc())
    )
    projects = result.scalars().all()
    return [await _project_response(p, db) for p in projects]


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project = Project(user_id=current_user.id, **project_data.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return await _project_response(project, db)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return await _project_response(project, db)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in project_data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    await db.commit()
    await db.refresh(project)
    return await _project_response(project, db)


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.is_active = False
    await db.commit()
