from dotenv import load_dotenv
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api import auth, documents, extract, chunk, index, search, ask

app = FastAPI(title="RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(extract.router)
app.include_router(chunk.router)
app.include_router(index.router)
app.include_router(search.router)
app.include_router(ask.router)

@app.get("/health")
def health():
    return {"status": "ok"}
