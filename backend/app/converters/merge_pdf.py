from pypdf import PdfWriter


def merge_pdfs(input_paths: list[str], output_path: str) -> str:
    """
    Merge PDFs in the given order into a single output PDF.
    """
    if len(input_paths) < 2:
        raise ValueError("merge_pdfs requires at least two input files")

    writer = PdfWriter()
    for path in input_paths:
        writer.append(path)

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
