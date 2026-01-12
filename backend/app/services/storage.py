# app/services/storage.py
import os
from supabase import create_client
from storage3.exceptions import StorageApiError

def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY"),
    )

BUCKET = os.getenv("SUPABASE_BUCKET")

def upload_pdf(file_bytes: bytes, file_path: str) -> str:
    supabase = get_supabase()

    try:
        response = supabase.storage.from_(BUCKET).upload(
            file_path,
            file_bytes,
            {"content-type": "application/pdf"},
        )
    except StorageApiError as e:
        # Supabase already gives a clean error
        raise RuntimeError(f"Upload failed: {e}") from e

    # ✅ Success path
    return supabase.storage.from_(BUCKET).get_public_url(file_path)
