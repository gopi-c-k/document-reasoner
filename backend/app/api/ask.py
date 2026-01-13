from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.vector_store import search
from app.services.llm_service import generate_answer

router = APIRouter(prefix="/ask", tags=["Ask"])


@router.post("/")
def ask_question(
    document_id: str,
    question: str,
    user_id: str = Depends(get_current_user)
):
    # 1. Retrieve relevant chunks (document-scoped)
    results = search(
        query=question,
        document_id=document_id,
        top_k=5
    )

    if not results:
        return {
            "answer": "No relevant information found in the document."
        }

    chunks = [r["text"] for r in results]

    # 2. Generate answer using LLM
    answer = generate_answer(question, chunks)

    return {
        "question": question,
        "answer": answer
    }
