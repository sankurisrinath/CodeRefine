from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import logging
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.analysis_request import AnalysisRequest
from models.analysis_history import AnalysisHistory
from models.project_activity import ProjectActivity, ActionType
from models.project import Project
from models.file import File
from models.user import User
from services.static_analyzer import run_static_analysis
from services.groq_service import analyze_with_groq
from services.aggregation_engine import aggregate_issues
from services.confidence_engine import compute_confidence
from utils.auth import get_current_user_optional

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/api/analyze")
async def analyze(
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    try:
        code = request.code
        file_name = None

        # If project_id and file_id provided, fetch file content from DB
        if request.project_id and request.file_id and current_user:
            proj_result = await db.execute(
                select(Project).where(
                    Project.id == request.project_id,
                    Project.user_id == current_user.id,
                )
            )
            project = proj_result.scalar_one_or_none()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            file_result = await db.execute(
                select(File).where(
                    File.id == request.file_id,
                    File.project_id == request.project_id,
                )
            )
            db_file = file_result.scalar_one_or_none()
            if not db_file:
                raise HTTPException(status_code=404, detail="File not found")
            if not db_file.content:
                raise HTTPException(status_code=422, detail="Selected file has no content to analyze")

            code = db_file.content
            file_name = db_file.name

        # 1. Run static analysis
        static_issues = run_static_analysis(request.language, code)

        # 2. Get AI analysis from Groq
        groq_result = analyze_with_groq(
            language=request.language,
            mode=request.mode,
            instruction=request.instruction,
            code=code,
            static_issues=static_issues,
        )

        # 3. Aggregate static + AI issues
        aggregated = aggregate_issues(static_issues, groq_result["ai_issues"])

        # 4. Compute confidence score
        confidence = compute_confidence(aggregated)

        # 5. Save to database ONLY if user is logged in
        analysis_id = None
        if current_user:
            analysis_record = AnalysisHistory(
                user_id=current_user.id,
                language=request.language,
                mode=request.mode,
                code_snippet=code[:10000],  # Limit to 10k chars
                instruction=request.instruction,
                static_issues=static_issues,
                ai_suggestions=groq_result["ai_issues"],
                aggregated_issues=aggregated,
                optimized_code=groq_result["optimized_code"],
                explanation=groq_result.get("explanation", ""),
                confidence_score=confidence,
            )
            db.add(analysis_record)

            # Log ANALYZE_FILE activity when analyzing a project file
            if request.project_id and request.file_id and file_name:
                activity = ProjectActivity(
                    user_id=current_user.id,
                    project_id=request.project_id,
                    file_id=request.file_id,
                    action_type=ActionType.ANALYZE_FILE,
                    file_name=file_name,
                )
                db.add(activity)

            await db.commit()
            await db.refresh(analysis_record)
            analysis_id = analysis_record.id

        return {
            "static_issues": static_issues,
            "ai_suggestions": groq_result["ai_issues"],
            "aggregated_issues": aggregated,
            "optimized_code": groq_result["optimized_code"],
            "explanation": groq_result.get("explanation", ""),
            "confidence_score": confidence,
            "analysis_id": analysis_id,
            "saved": current_user is not None,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis endpoint error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={
            "static_issues": [],
            "ai_suggestions": [],
            "aggregated_issues": [],
            "optimized_code": request.code,
            "explanation": f"Server error: {str(e)}",
            "confidence_score": 0,
        })
