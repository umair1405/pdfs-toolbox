from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user_optional
from app.core.config import settings
from app.models.file import File as FileModel
from app.models.user import User
from app.schemas.conversion import FileOut
from app.services.storage import storage_service

router = APIRouter(prefix="/upload", tags=["upload"])

# Every MIME type the frontend can send us
ALLOWED_MIME_TYPES = {
    # PDFs
    "application/pdf",
    # Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    # PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    # Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    # Images (for jpg_to_pdf, scan_to_pdf)
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
}


@router.post("", response_model=FileOut)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    print("STEP 1")
    
    mime = (file.content_type or "").split(";")[0].strip().lower()
    print("MIME:", mime)

    stored_path, size = storage_service.save_upload(file)
    print("STEP 2", stored_path, size)

    db_file = FileModel(
        owner_id=current_user.id if current_user else None,
        original_filename=file.filename,
        stored_path=stored_path,
        mime_type=mime,
        size_bytes=size,
    )
    print("STEP 3")

    db.add(db_file)
    db.commit()
    print("STEP 4")

    db.refresh(db_file)
    print("STEP 5")

    return db_file