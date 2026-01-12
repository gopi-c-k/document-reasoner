from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api import auth, documents, extract, chunk

app = FastAPI(title="RAG Backend")

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(extract.router)
app.include_router(chunk.router)


@app.get("/health")
def health():
    return {"status": "ok"}
