import PyPDF2
import io
from models import CandidateModel


class DocumentReader:
    """
    A class to handle reading and extracting text from resume files.
    Supports PDF format currently.
    """

    @staticmethod
    def read_pdf_text(resume_file):
        """
        Extracts text from a PDF file.

        Args:
            resume_file (file-like object): The PDF file to be read.

        Returns:
            str: The extracted text from the PDF.
        """
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(resume_file.read()))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text().strip()
            return text
        except Exception as e:
            raise ValueError(f"Error reading PDF file: {e}")

    @staticmethod
    def extract_resume_text(resume_file):
        """
        Extracts text from a resume file (PDF or other supported formats).

        Args:
            resume_file (file-like object): The resume file to be read.

        Returns:
            str: The extracted text from the resume file.
        """
        file_type = resume_file.name.split(".")[-1].lower()
        if file_type == "pdf":
            return DocumentReader.read_pdf_text(resume_file)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
