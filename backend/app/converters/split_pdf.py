import zipfile
from pathlib import Path

from pypdf import PdfReader, PdfWriter


def split_pdf(input_path: str, output_dir: str, ranges: list[tuple[int, int]] | None = None) -> str:
    """
    Split a PDF into multiple PDFs and return a path to a zip archive containing them.
    `ranges` is a list of (start, end) page numbers, 1-indexed, inclusive.
    If omitted, splits into one PDF per page.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    reader = PdfReader(input_path)
    total_pages = len(reader.pages)

    if not ranges:
        ranges = [(i + 1, i + 1) for i in range(total_pages)]

    output_paths: list[str] = []
    for idx, (start, end) in enumerate(ranges, start=1):
        if start < 1 or end > total_pages or start > end:
            raise ValueError(f"Invalid page range {start}-{end} for a {total_pages}-page document")
        writer = PdfWriter()
        for page_num in range(start - 1, end):
            writer.add_page(reader.pages[page_num])
        part_path = str(Path(output_dir) / f"part_{idx}_pages_{start}-{end}.pdf")
        with open(part_path, "wb") as f:
            writer.write(f)
        output_paths.append(part_path)

    zip_path = str(Path(output_dir) / "split_result.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in output_paths:
            zf.write(p, arcname=Path(p).name)

    return zip_path
