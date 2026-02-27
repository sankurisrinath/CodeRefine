import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class ActionType(str, enum.Enum):
    CREATE_FILE = "CREATE_FILE"
    UPLOAD_FILE = "UPLOAD_FILE"
    EDIT_FILE = "EDIT_FILE"
    ANALYZE_FILE = "ANALYZE_FILE"
    EXPORT_FILE = "EXPORT_FILE"


class ProjectActivity(Base):
    __tablename__ = "project_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="SET NULL"), nullable=True)
    action_type = Column(SAEnum(ActionType), nullable=False)
    file_name = Column(String(255), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="activities")
    project = relationship("Project", backref="activities")
