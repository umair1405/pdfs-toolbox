from pdf2docx import Converter


def pdf_to_word(input_path: str, output_path: str) -> str:
    """
    Convert a PDF into an editable .docx, preserving layout, tables, and images.
    """
    cv = Converter(input_path)
    try:
        cv.convert(output_path, start=0, end=None)
    finally:
        cv.close()
    return output_path
