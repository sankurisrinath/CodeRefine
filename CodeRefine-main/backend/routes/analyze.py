from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.analysis_request import AnalysisRequest
from models.analysis_history import AnalysisHistory
from models.user import User
from services.static_analyzer import run_static_analysis
from services.groq_service import analyze_with_groq
from services.aggregation_engine import aggregate_issues
from services.confidence_engine import compute_confidence
from utils.auth import get_current_active_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze")
async def analyze(
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        # 1. Run static analysis
        static_issues = run_static_analysis(request.language, request.code)

        # 2. Get AI analysis from Groq
        groq_result = analyze_with_groq(
            language=request.language,
            mode=request.mode,
            instruction=request.instruction,
            code=request.code,
            static_issues=static_issues,
        )

        # 3. Aggregate static + AI issues
        aggregated = aggregate_issues(static_issues, groq_result["ai_issues"])

        # 4. Compute confidence score
        confidence = compute_confidence(aggregated)

        # 5. Save to database
        analysis_record = AnalysisHistory(
            user_id=current_user.id,
            language=request.language,
            mode=request.mode,
            code_snippet=request.code[:10000],  # Limit to 10k chars
            instruction=request.instruction,
            static_issues=static_issues,
            ai_suggestions=groq_result["ai_issues"],
            aggregated_issues=aggregated,
            optimized_code=groq_result["optimized_code"],
            explanation=groq_result.get("explanation", ""),
            confidence_score=confidence,
        )
        db.add(analysis_record)
        await db.commit()

        return {
            "static_issues": static_issues,
            "ai_suggestions": groq_result["ai_issues"],
            "aggregated_issues": aggregated,
            "optimized_code": groq_result["optimized_code"],
            "explanation": groq_result.get("explanation", ""),
            "confidence_score": confidence,
            "analysis_id": analysis_record.id,
        }
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
