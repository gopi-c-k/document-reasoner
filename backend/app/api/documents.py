import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.core.security import get_current_user
from app.db.postgres import get_db
from app.services.storage import upload_pdf

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    file_bytes = file.file.read()
    doc_id = str(uuid.uuid4())
    storage_path = f"{user_id}/{doc_id}.pdf"

    file_url = upload_pdf(file_bytes, storage_path)

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO documents (id, user_id, filename, file_url)
        VALUES (%s, %s, %s, %s)
        """,
        (doc_id, user_id, file.filename, file_url)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "PDF uploaded successfully",
        "document_id": doc_id,
        "file_url": file_url
    }
