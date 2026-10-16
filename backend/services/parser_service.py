import re
import logging
from typing import Dict, List, Tuple
from backend.services.ai_service import extract_profile_data_with_gemini

logger = logging.getLogger(__name__)

# Fallbacks for libraries that may be installing
PYMUPDF_AVAILABLE = False
SPACY_AVAILABLE = False
spacy = None
fitz = None

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    logger.warning("PyMuPDF (fitz) not available yet. Using fallback text reader.")

# spaCy is imported dynamically inside functions to save memory at startup


# List of common tech skills for local regex fallback extraction
COMMON_TECH_SKILLS = [
    "python", "java", "c++", "c", "c#", "javascript", "typescript", "html", "css",
    "react", "angular", "vue", "node.js", "express", "django", "flask", "fastapi",
    "spring boot", "sql", "mysql", "postgresql", "oracle", "mongodb", "redis",
    "aws", "gcp", "azure", "docker", "kubernetes", "git", "github", "ci/cd",
    "machine learning", "deep learning", "nlp", "computer vision", "data structures",
    "algorithms", "dbms", "operating systems", "computer networks", "cuda", "excel",
    "tableau", "power bi", "agile", "scrum", "project management", "communication"
]

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract plain text from PDF file using PyMuPDF."""
    global PYMUPDF_AVAILABLE, fitz
    if not PYMUPDF_AVAILABLE or fitz is None:
        # Check if fitz can be imported now
        try:
            import fitz
            PYMUPDF_AVAILABLE = True
        except ImportError:
            return "Error: PyMuPDF is not installed. Unable to parse PDF."
            
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        logger.error(f"Error reading PDF {pdf_path}: {e}")
        return f"Error parsing PDF: {str(e)}"

def local_regex_extraction(text: str) -> Dict:
    """Extract skills, certifications, and education using keyword matching and regex."""
    text_lower = text.lower()
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    
    # 1. Skills extraction
    found_skills = []
    for skill in COMMON_TECH_SKILLS:
        # Use word boundaries for skill match to avoid substring false positives (e.g. 'c' matching in 'cat')
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill.title() if len(skill) > 2 else skill.upper())
            
    # 2. Programming Languages
    languages = ["Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "SQL", "HTML/CSS", "Go", "Rust", "Swift"]
    found_languages = [lang for lang in languages if re.search(r'\b' + re.escape(lang.lower()) + r'\b', text_lower)]
    
    # 3. Certifications
    certs = []
    cert_patterns = [
        r"(certified|certification|credential)",
        r"(aws|azure|google cloud|ccna|ocp|pmp|udemy|coursera|nptel)\s+[\w\s]{3,20}\b"
    ]
    lines = text.split('\n')
    for line in lines:
        if any(re.search(pat, line.lower()) for pat in cert_patterns) and len(line.strip()) < 100:
            certs.append(line.strip())
            
    # 4. GPA Extraction
    gpa = 0.0
    gpa_match = re.search(r'\b(cgpa|gpa|pointer)\b:?\s*(\d+(\.\d+)?)\b', text_lower)
    if gpa_match:
        try:
            gpa = float(gpa_match.group(2))
            if gpa > 10.0 and gpa <= 100.0:  # Percentage format
                gpa = gpa / 10.0
        except ValueError:
            pass

    name = ""
    if lines:
        first_line = re.sub(r"\s+", " ", lines[0]).strip()
        if (
            len(first_line.split()) <= 6
            and not re.search(r"@|resume|curriculum|summary|skills|experience", first_line, re.I)
        ):
            name = first_line

    college = ""
    for line in lines:
        if re.search(r"\b(university|college|institute|school)\b", line, re.I):
            college = re.sub(r"^(education|college|university)\s*[:|-]\s*", "", line, flags=re.I)
            break

    branch = ""
    branch_match = re.search(
        r"\b(?:branch|speciali[sz]ation|major|degree)\s*[:|-]?\s*([^\n|,]{3,80})",
        text,
        re.I,
    )
    if branch_match:
        branch = branch_match.group(1).strip(" .")

    grad_year = None
    grad_match = re.search(
        r"\b(?:graduat(?:ed|ion)|passing|expected|class of|batch)\D{0,20}(20\d{2})\b",
        text,
        re.I,
    )
    if grad_match:
        grad_year = int(grad_match.group(1))

    return {
        "name": name,
        "college": college,
        "branch": branch,
        "grad_year": grad_year,
        "skills": found_skills,
        "programming_languages": found_languages,
        "certifications": certs[:5],
        "cgpa": gpa
    }

def spacy_extraction(text: str) -> Dict:
    """Extract education, organisations (companies), and projects using spaCy NER model."""
    global SPACY_AVAILABLE, spacy
    import os
    if os.getenv("RENDER") == "true" or os.getenv("DISABLE_SPACY") == "True":
        return {"organizations": [], "education": []}
    if not SPACY_AVAILABLE or spacy is None:
        try:
            import spacy
            SPACY_AVAILABLE = True
        except ImportError:
            return {"organizations": [], "education": []}

    try:
        # Load small english model. If not downloaded, this will throw an error
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        
        orgs = []
        edu = []
        for ent in doc.ents:
            if ent.label_ == "ORG" and len(ent.text.strip()) > 3:
                # Basic classifier: check if it resembles college or company
                org_text = ent.text.strip()
                if any(k in org_text.lower() for k in ["university", "college", "institute", "school"]):
                    edu.append(org_text)
                else:
                    orgs.append(org_text)
                    
        return {
            "organizations": list(set(orgs))[:10],
            "education": list(set(edu))[:5]
        }
    except Exception as e:
        logger.warning(f"spaCy model 'en_core_web_sm' not available: {e}. Downloading model or falling back.")
        return {"organizations": [], "education": []}

def parse_resume(pdf_path: str) -> Dict:
    """
    Perform a complete extraction of the resume:
    1. Extract PDF text.
    2. Local parser fallback (skills, languages, gpa via regex).
    3. NLP parser (spaCy NER for colleges and organizations).
    4. AI High-Accuracy Parser (Gemini structured extraction if key is present).
    """
    raw_text = extract_text_from_pdf(pdf_path)
    if raw_text.startswith("Error"):
        return {
            "name": "Unknown",
            "college": "",
            "branch": "",
            "grad_year": None,
            "cgpa": 0.0,
            "skills": [],
            "programming_languages": [],
            "projects": [],
            "certifications": [],
            "text": raw_text
        }
        
    # Get local matches (regex & spaCy if available)
    local_info = local_regex_extraction(raw_text)
    spacy_info = spacy_extraction(raw_text)
    
    # Try using Gemini for high-fidelity extraction
    try:
        ai_info = extract_profile_data_with_gemini(raw_text)
        
        # Merge results, prioritize AI parsed data but use local as backup
        # A resume header is more reliable than an AI placeholder such as "Candidate".
        name = local_info.get("name") or ai_info.get("name") or "Candidate"
        college = ai_info.get("college", spacy_info.get("education", [""])[0] if spacy_info.get("education") else "")
        college = college or local_info.get("college", "")
        branch = ai_info.get("branch") or local_info.get("branch", "")
        grad_year = ai_info.get("grad_year") or local_info.get("grad_year")
        cgpa = ai_info.get("cgpa", local_info.get("cgpa", 0.0))
        
        # Ensure we have skills and programming languages
        skills = ai_info.get("skills") or local_info.get("skills", [])
        languages = ai_info.get("programming_languages") or local_info.get("programming_languages", [])
        projects = ai_info.get("projects") or []
        certifications = ai_info.get("certifications") or local_info.get("certifications", [])
        
    except Exception as e:
        logger.error(f"Gemini resume extraction failed, using local extraction fallback: {e}")
        name = local_info.get("name") or "Candidate"
        college = (
            spacy_info.get("education", [""])[0]
            if spacy_info.get("education")
            else local_info.get("college", "")
        )
        branch = local_info.get("branch", "")
        grad_year = local_info.get("grad_year")
        cgpa = local_info.get("cgpa", 0.0)
        skills = local_info.get("skills", [])
        languages = local_info.get("programming_languages", [])
        projects = []
        certifications = local_info.get("certifications", [])

    return {
        "name": name,
        "college": college,
        "branch": branch,
        "grad_year": grad_year,
        "cgpa": cgpa,
        "skills": skills,
        "programming_languages": languages,
        "projects": projects,
        "certifications": certifications,
        "text": raw_text
    }
