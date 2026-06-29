from datetime import datetime
from pathlib import Path

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.conversion_job import ConversionJob
from app.models.file import File as FileModel
from app.services.storage import storage_service

from app.converters.pdf_to_word import pdf_to_word
from app.converters.word_to_pdf import word_to_pdf
from app.converters.merge_pdf import merge_pdfs
from app.converters.split_pdf import split_pdf
from app.converters.compress_pdf import compress_pdf
from app.converters.ocr_pdf import ocr_pdf
from app.converters.pdf_to_image import pdf_to_image


# MIME types that go through LibreOffice → PDF
OFFICE_MIMES = {
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


@celery_app.task(name="convert_file_task", bind=True, max_retries=1)
def convert_file_task(self, job_id: str) -> None:
    db = SessionLocal()
    try:
        job = db.query(ConversionJob).filter(ConversionJob.id == job_id).first()
        if not job:
            return

        job.status = "processing"
        db.commit()

        source = db.query(FileModel).filter(FileModel.id == job.file_id).first()
        if not source:
            raise RuntimeError("Source file no longer exists in storage.")

        stem = Path(source.original_filename).stem
        output_dir = str(Path(source.stored_path).parent.parent / "outputs")

        # ── Dispatch ───────────────────────────────────────────────────────────
        out_path: str

        if job.operation == "convert":

            # Office file → PDF via LibreOffice
            if source.mime_type in OFFICE_MIMES and job.target_format == "pdf":
                out_path = word_to_pdf(source.stored_path, output_dir)

            # PDF → DOCX via pdf2docx
            elif job.target_format == "docx":
                dest = storage_service.output_path(f"{stem}.docx")
                out_path = pdf_to_word(source.stored_path, dest)

            # PDF → JPG / PNG via PyMuPDF
            elif job.target_format in ("jpg", "png"):
                out_path = pdf_to_image(
                    source.stored_path, output_dir, fmt=job.target_format
                )

            else:
                raise RuntimeError(
                    f"Unsupported convert target '{job.target_format}' "
                    f"for source mime '{source.mime_type}'."
                )

        elif job.operation == "merge":
            # Expects options.file_ids list of already-uploaded stored paths
            extra_paths = (job.options or {}).get("file_ids", [])
            all_paths = [source.stored_path] + extra_paths
            dest = storage_service.output_path(f"{stem}_merged.pdf")
            out_path = merge_pdfs(all_paths, dest)

        elif job.operation == "split":
            ranges = (job.options or {}).get("ranges")  # None = one-per-page
            out_path = split_pdf(source.stored_path, output_dir, ranges)

        elif job.operation == "compress":
            dest = storage_service.output_path(f"{stem}_compressed.pdf")
            out_path = compress_pdf(source.stored_path, dest)

        elif job.operation == "ocr":
            dest = storage_service.output_path(f"{stem}_ocr.pdf")
            lang = (job.options or {}).get("lang", "eng")
            out_path = ocr_pdf(source.stored_path, dest, lang=lang)

        else:
            raise RuntimeError(f"Unknown operation '{job.operation}'.")

        # ── Mark done ──────────────────────────────────────────────────────────
        job.output_path = out_path
        job.status = "done"
        job.completed_at = datetime.utcnow()
        db.commit()

    except Exception as exc:  # noqa: BLE001
        db.rollback()
        job = db.query(ConversionJob).filter(ConversionJob.id == job_id).first()
        if job:
            job.status = "failed"
            job.error_message = str(exc)[:1000]
            job.completed_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()
