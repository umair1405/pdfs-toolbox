import io
import fitz  # PyMuPDF
from PIL import Image


def compress_pdf(input_path: str, output_path: str, image_quality: int = 60, max_dimension: int = 1600) -> str:
    """
    Shrink a PDF by downsampling/recompressing embedded images and
    enabling stream compression on save. Vector content and text are untouched.
    """
    doc = fitz.open(input_path)

    for page in doc:
        for img_info in page.get_images(full=True):
            xref = img_info[0]
            try:
                base_image = doc.extract_image(xref)
            except Exception:
                continue

            image_bytes = base_image["image"]
            pil_img = Image.open(io.BytesIO(image_bytes))

            if pil_img.width > max_dimension or pil_img.height > max_dimension:
                ratio = max_dimension / max(pil_img.width, pil_img.height)
                pil_img = pil_img.resize(
                    (int(pil_img.width * ratio), int(pil_img.height * ratio)),
                    Image.LANCZOS,
                )

            buffer = io.BytesIO()
            if pil_img.mode in ("RGBA", "P"):
                pil_img = pil_img.convert("RGB")
            pil_img.save(buffer, format="JPEG", quality=image_quality, optimize=True)

            doc.update_stream(xref, buffer.getvalue())

    doc.save(output_path, garbage=4, deflate=True, clean=True)
    doc.close()
    return output_path
