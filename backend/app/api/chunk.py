from fastapi import APIRouter, Depends, HTTPException
from app.db.postgres import get_db
from app.core.security import get_current_user
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.chunker import chunk_text

router = APIRouter(prefix="/chunk", tags=["Chunk"])


@router.get("/{document_id}")
def chunk_document(
    document_id: str,
    user_id: str = Depends(get_current_user)
):
    conn = get_db()
    cur = conn.cursor()

    # 1. Get file URL (ownership check)
    cur.execute(
        """
        SELECT file_url
        FROM documents
        WHERE id = %s AND user_id = %s
        """,
        (document_id, user_id)
    )

    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Document not found")

    file_url = row[0]

    # 2. Extract text
    text = extract_text_from_pdf(file_url)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found")

    # 3. Chunk text
    chunks = chunk_text(text)

    return {
        "document_id": document_id,
        "total_chunks": len(chunks),
        "sample_chunks": chunks[:3]
    }
