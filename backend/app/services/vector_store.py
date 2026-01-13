import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# -------- CONFIG --------
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
VECTOR_DIM = 384  # fixed for this model

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STORE_DIR = os.path.join(BASE_DIR, "vector_store")

INDEX_PATH = os.path.join(STORE_DIR, "index.faiss")
META_PATH = os.path.join(STORE_DIR, "metadata.json")

os.makedirs(STORE_DIR, exist_ok=True)

# -------- LOAD MODEL --------
model = SentenceTransformer(EMBEDDING_MODEL)

# -------- LOAD OR CREATE INDEX --------
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
    with open(META_PATH, "r") as f:
        metadata = json.load(f)
else:
    index = faiss.IndexFlatL2(VECTOR_DIM)
    metadata = []

def add_chunks(chunks: list, document_id: str):
    """
    Converts chunks to embeddings and stores them in FAISS.
    """

    embeddings = model.encode(chunks)

    # Convert to float32 numpy array
    vectors = np.array(embeddings).astype("float32")

    index.add(vectors)

    # Save metadata
    for chunk in chunks:
        metadata.append({
            "document_id": document_id,
            "text": chunk
        })

    # Persist to disk
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "w") as f:
        json.dump(metadata, f)
        
def search(query: str, document_id: str, top_k: int = 5):
    """
    Semantic search restricted to a single document.
    """

    query_embedding = model.encode([query])
    query_vector = np.array(query_embedding).astype("float32")

    distances, indices = index.search(query_vector, top_k * 5)
    # ↑ search wider, then filter

    results = []

    for idx in indices[0]:
        if idx >= len(metadata):
            continue

        chunk_meta = metadata[idx]

        if chunk_meta["document_id"] == document_id:
            results.append(chunk_meta)

        if len(results) == top_k:
            break

    return results
