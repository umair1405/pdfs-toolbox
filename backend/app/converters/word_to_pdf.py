import subprocess
import shutil
from pathlib import Path


def word_to_pdf(input_path: str, output_dir: str, timeout: int = 120) -> str:
    """
    Convert .docx/.pptx/.xlsx to PDF using headless LibreOffice.
    Requires the `libreoffice` binary on PATH (installed in docker/backend.Dockerfile).
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    result = subprocess.run(
        [
            "soffice",
            "--headless",
            "--norestore",
            "--convert-to", "pdf",
            "--outdir", output_dir,
            input_path,
        ],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        raise RuntimeError(f"LibreOffice conversion failed: {result.stderr.strip()}")

    produced = Path(output_dir) / (Path(input_path).stem + ".pdf")
    if not produced.exists():
        raise RuntimeError("LibreOffice reported success but no output file was found")
    return str(produced)
