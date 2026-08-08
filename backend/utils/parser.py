import os
import re
import pdfplumber
from docx import Document

from data.skills import SKILLS


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text: str) -> str:
    """
    Clean and normalize extracted resume text.
    """

    if not text:
        return ""

    # Remove null bytes
    text = text.replace("\x00", " ")

    # Remove invalid control characters
    text = re.sub(
        r"[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]",
        " ",
        text
    )

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ============================================================
# PDF EXTRACTION
# ============================================================

def extract_pdf_text(pdf_path: str) -> str:
    """
    Extract text from a PDF resume.
    """

    text_parts = []

    try:
        with pdfplumber.open(pdf_path) as pdf:

            for page in pdf.pages:

                extracted = page.extract_text()

                if extracted:
                    text_parts.append(extracted)

    except Exception as e:
        raise ValueError(
            f"Failed to extract PDF text: {str(e)}"
        )

    return "\n".join(text_parts)


# ============================================================
# DOCX EXTRACTION
# ============================================================

def extract_docx_text(docx_path: str) -> str:
    """
    Extract text from a DOCX resume.
    """

    text_parts = []

    try:
        document = Document(docx_path)

        # Extract normal paragraphs
        for paragraph in document.paragraphs:

            if paragraph.text.strip():
                text_parts.append(
                    paragraph.text
                )

        # Extract tables
        for table in document.tables:

            for row in table.rows:

                row_text = []

                for cell in row.cells:

                    if cell.text.strip():
                        row_text.append(
                            cell.text.strip()
                        )

                if row_text:
                    text_parts.append(
                        " ".join(row_text)
                    )

    except Exception as e:
        raise ValueError(
            f"Failed to extract DOCX text: {str(e)}"
        )

    return "\n".join(text_parts)


# ============================================================
# MAIN TEXT EXTRACTION
# ============================================================

def extract_text(file_path: str) -> str:
    """
    Extract text from PDF or DOCX resume.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    extension = os.path.splitext(
        file_path
    )[1].lower()

    if extension == ".pdf":

        text = extract_pdf_text(
            file_path
        )

    elif extension == ".docx":

        text = extract_docx_text(
            file_path
        )

    else:

        raise ValueError(
            "Unsupported file type. "
            "Only PDF and DOCX are supported."
        )

    text = clean_text(text)

    if not text:
        raise ValueError(
            "No readable text found in the resume."
        )

    return text


# ============================================================
# SKILL EXTRACTION
# ============================================================

def extract_skill(text: str):
    """
    Extract skills defined in data/skills.py
    from the resume text.
    """

    if not text:
        return []

    text = text.lower()

    found_skills = []

    for skill in SKILLS:

        skill_lower = skill.lower()

        # Prevent partial word matches.
        pattern = r"(?<!\w)" + re.escape(
            skill_lower
        ) + r"(?!\w)"

        if re.search(pattern, text):

            found_skills.append(skill)

    return found_skills