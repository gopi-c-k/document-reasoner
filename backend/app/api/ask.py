from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.security import get_current_user
from app.services.vector_store import search
from app.services.llm_service import generate_answer

router = APIRouter(prefix="/ask", tags=["Ask"])


# -------- Request Body Model --------
class AskRequest(BaseModel):
    document_id: str
    question: str


@router.post("/")
def ask_question(
    payload: AskRequest,                 # ✅ BODY
    user_id: str = Depends(get_current_user)
):
    # 1. Retrieve chunks from FAISS (scoped)
    results = search(
        query=payload.question,
        document_id=payload.document_id,
        top_k=5
    )

    if not results:
        return {
            "answer": "No relevant information found in the document."
        }

    chunks = [r["text"] for r in results]

    # 2. Generate answer using LLM
    answer = generate_answer(
        question=payload.question,
        chunks=chunks
    )

    return {
        "question": payload.question,
        "answer": answer
    }
