from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.conversion_job import ConversionJob

router = APIRouter(prefix="/files", tags=["files"])


@router.get("/{job_id}/download")
def download_result(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ConversionJob).filter(ConversionJob.id == job_id).first()
    if not job or job.status != "done" or not job.output_path:
        raise HTTPException(status_code=404, detail="Result not ready or not found")

    path = Path(job.output_path)
    if not path.exists():
        raise HTTPException(status_code=410, detail="Result file has been cleaned up")

    return FileResponse(path=str(path), filename=path.name, media_type="application/octet-stream")
