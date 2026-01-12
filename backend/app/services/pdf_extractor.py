import io
import os
import pdfplumber
from urllib.parse import urlparse
from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"]
)

def extract_text_from_pdf(file_url: str) -> str:
    """
    Accepts a Supabase file URL, extracts bucket + path,
    downloads via Supabase API, and extracts text.
    """

    print(f"Received file URL: {file_url}")

    bucket, path = _parse_supabase_file_url(file_url)

    print(f"Resolved bucket={bucket}, path={path}")

    # 1. Download file securely
    pdf_bytes: bytes = supabase.storage.from_(bucket).download(path)

    if not pdf_bytes:
        raise ValueError("Downloaded PDF is empty")

    # 2. Convert bytes → file-like object
    pdf_file = io.BytesIO(pdf_bytes)

    # 3. Extract text
    extracted_text = []

    with pdfplumber.open(pdf_file) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text:
                extracted_text.append(text)

    return "\n".join(extracted_text)


def _parse_supabase_file_url(file_url: str) -> tuple[str, str]:
    """
    Converts:
    https://PROJECT.supabase.co/storage/v1/object/public/BUCKET/path/to/file.pdf

    → ("BUCKET", "path/to/file.pdf")
    """

    parsed = urlparse(file_url)

    parts = parsed.path.split("/")

    # Expected structure:
    # /storage/v1/object/public/{bucket}/{path...}
    try:
        bucket_index = parts.index("public") + 1
        bucket = parts[bucket_index]
        path = "/".join(parts[bucket_index + 1 :])
    except (ValueError, IndexError):
        raise ValueError("Invalid Supabase storage URL format")

    return bucket, path
