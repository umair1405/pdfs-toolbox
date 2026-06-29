import io
from pathlib import Path

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from pypdf import PdfWriter, PdfReader


def ocr_pdf(input_path: str, output_path: str, lang: str = "eng", dpi: int = 200) -> str:
    """
    Render each page to an image, run Tesseract to produce a searchable
    single-page PDF with an invisible text layer, then stitch the pages
    back together into one output PDF.
    """
    doc = fitz.open(input_path)
    writer = PdfWriter()
    zoom = dpi / 72

    for page in doc:
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        img = Image.open(io.BytesIO(pix.tobytes("png")))

        # Tesseract can emit a ready-made searchable PDF per page.
        page_pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, lang=lang, extension="pdf")
        page_reader = PdfReader(io.BytesIO(page_pdf_bytes))
        writer.add_page(page_reader.pages[0])

    doc.close()
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
