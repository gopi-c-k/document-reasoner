from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.vector_store import search

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/")
def semantic_search(
    q: str, 
    document_id: str,
    user_id: str = Depends(get_current_user)
):
    results = search(
        query=q,
        document_id=document_id
    )

    return {
        "query": q,
        "document_id": document_id,
        "results": results
    }
