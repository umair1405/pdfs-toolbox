import os
import uuid
import shutil
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


class StorageService:
    """
    Local-disk implementation. Swap this class for an S3-backed one later
    by keeping the same three methods — nothing above this layer needs to change.
    """

    def __init__(self) -> None:
        self.root = Path(settings.STORAGE_PATH)
        (self.root / "uploads").mkdir(parents=True, exist_ok=True)
        (self.root / "outputs").mkdir(parents=True, exist_ok=True)

    def save_upload(self, upload: UploadFile) -> tuple[str, int]:
        ext = Path(upload.filename or "").suffix
        stored_name = f"{uuid.uuid4()}{ext}"
        dest = self.root / "uploads" / stored_name
        with dest.open("wb") as out_file:
            shutil.copyfileobj(upload.file, out_file)
        size = dest.stat().st_size
        return str(dest), size

    def output_path(self, suggested_name: str) -> str:
        dest = self.root / "outputs" / f"{uuid.uuid4()}_{suggested_name}"
        return str(dest)

    def delete(self, path: str) -> None:
        try:
            os.remove(path)
        except FileNotFoundError:
            pass


storage_service = StorageService()
