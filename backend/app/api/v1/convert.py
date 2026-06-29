from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.conversion_job import ConversionJob
from app.models.file import File as FileModel
from app.schemas.conversion import ConversionCreate, ConversionJobOut
from app.workers.tasks import convert_file_task

router = APIRouter(prefix="/convert", tags=["convert"])


@router.post("", response_model=ConversionJobOut)
def create_conversion(data: ConversionCreate, db: Session = Depends(get_db)):
    source = db.query(FileModel).filter(FileModel.id == data.file_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="File not found")

    job = ConversionJob(
        file_id=data.file_id,
        target_format=data.target_format,
        operation=data.operation,
        status="queued",
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    convert_file_task.delay(str(job.id))

    return _to_job_out(job)


@router.get("/{job_id}", response_model=ConversionJobOut)
def get_conversion(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ConversionJob).filter(ConversionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return _to_job_out(job)


def _to_job_out(job: ConversionJob) -> ConversionJobOut:
    out = ConversionJobOut.model_validate(job)
    if job.status == "done" and job.output_path:
        out.download_url = f"/api/v1/files/{job.id}/download"
    return out
