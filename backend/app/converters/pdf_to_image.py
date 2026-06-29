import zipfile
from pathlib import Path

import fitz  # PyMuPDF


def pdf_to_image(input_path: str, output_dir: str, fmt: str = "png", dpi: int = 200) -> str:
    """
    Render every page of a PDF to an image. Returns a single image path if
    the PDF has one page, otherwise a zip archive of all pages.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    doc = fitz.open(input_path)
    zoom = dpi / 72
    output_paths: list[str] = []

    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        out_path = str(Path(output_dir) / f"page_{i}.{fmt}")
        pix.save(out_path)
        output_paths.append(out_path)

    doc.close()

    if len(output_paths) == 1:
        return output_paths[0]

    zip_path = str(Path(output_dir) / "pages.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in output_paths:
            zf.write(p, arcname=Path(p).name)
    return zip_path
