from pydantic import BaseModel
from typing import Optional


class AnalysisRequest(BaseModel):
    language: str
    mode: str
    code: str
    instruction: str = ""
    project_id: Optional[int] = None
    file_id: Optional[int] = None
