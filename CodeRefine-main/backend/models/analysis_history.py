from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    language = Column(String(50), nullable=False)
    mode = Column(String(50), nullable=False)
    code_snippet = Column(Text, nullable=False)
    instruction = Column(Text)
    static_issues = Column(JSON)
    ai_suggestions = Column(JSON)
    aggregated_issues = Column(JSON)
    optimized_code = Column(Text)
    explanation = Column(Text)
    confidence_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="analyses")
    project = relationship("Project", backref="analyses")
