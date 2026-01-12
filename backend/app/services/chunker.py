import re
from typing import List


def sentence_split(text: str) -> List[str]:
    """
    Splits text into sentences using punctuation and newlines.
    """
    sentences = re.split(r'(?<=[.!?])\s+|\n+', text)
    return [s.strip() for s in sentences if s.strip()]


def chunk_text(
    text: str,
    max_chars: int = 500,
    overlap_sentences: int = 1
):
    """
    Sentence-aware chunking.
    Avoids breaking words or sentences.
    """

    sentences = sentence_split(text)

    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_length = len(sentence)

        if current_length + sentence_length > max_chars:
            chunks.append(" ".join(current_chunk))

            # overlap last N sentences
            current_chunk = current_chunk[-overlap_sentences:]
            current_length = sum(len(s) for s in current_chunk)

        current_chunk.append(sentence)
        current_length += sentence_length

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
