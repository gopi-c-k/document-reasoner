import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(question: str, chunks: list[str]) -> str:
    """
    Generates a grounded answer using retrieved document chunks.
    """

    # ---- Build context ----
    context = "\n\n".join(
        [f"Chunk {i+1}:\n{chunk}" for i, chunk in enumerate(chunks)]
    )

    # ---- Strict RAG prompt ----
    prompt = f"""
You are an assistant answering questions ONLY using the provided document context.

Rules:
- Use ONLY the information from the context
- If the answer is not in the context, say: "The document does not contain this information."
- Do NOT use prior knowledge
- Be clear and concise

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model="llama3-70b-8192",  # fast + strong
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=512
    )

    return response.choices[0].message.content.strip()
