import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel

TargetFormat = Literal["docx", "pptx", "xlsx", "png", "jpg", "txt", "pdf"]
Operation = Literal["convert", "merge", "split", "compress", "ocr"]


class FileOut(BaseModel):
    id: uuid.UUID
    original_filename: str
    mime_type: str
    size_bytes: int
    created_at: datetime

    class Config:
        from_attributes = True


class ConversionCreate(BaseModel):
    file_id: uuid.UUID
    target_format: TargetFormat
    operation: Operation = "convert"
    options: dict = {}


class ConversionJobOut(BaseModel):
    id: uuid.UUID
    file_id: uuid.UUID
    target_format: str
    operation: str
    status: str
    error_message: str | None
    created_at: datetime
    completed_at: datetime | None
    download_url: str | None = None

    class Config:
        from_attributes = True
