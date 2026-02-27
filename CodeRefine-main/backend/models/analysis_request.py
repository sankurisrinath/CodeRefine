from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    language: str
    mode: str
    code: str
    instruction: str = ""
