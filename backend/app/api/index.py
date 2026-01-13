from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.postgres import get_db
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.chunker import chunk_text
from app.services.vector_store import add_chunks

router = APIRouter(prefix="/index", tags=["Index"])


@router.post("/{document_id}")
def index_document(
    document_id: str,
    user_id: str = Depends(get_current_user)
):
    conn = get_db()
    cur = conn.cursor()

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

    text = extract_text_from_pdf(file_url)
    chunks = chunk_text(text)

    add_chunks(chunks, document_id)

    return {
        "message": "Document indexed successfully",
        "total_chunks": len(chunks)
    }
