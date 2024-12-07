import asyncio
import time
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from models import CandidateModel


class ResumeParser:
    """
    ResumeParser class for extracting structured candidate information from resume text
    using the LLM-based pipeline.
    """

    MAX_RETRIES = 3  # Maximum number of retries
    INITIAL_RETRY_DELAY = 2  # Initial delay between retries in seconds

    def __init__(self, api_key: str, model_name: str = "llama3-8b-8192"):
        """
        Initializes the ResumeParser with the language model.

        Args:
            api_key (str): The API key for Groq API.
            model_name (str): The name of the LLM model to use.
        """
        self.llm = ChatGroq(
            temperature=0,
            api_key=api_key,
            model_name=model_name,
            model_kwargs={"response_format": {"type": "json_object"}},
        )
        self.parser = PydanticOutputParser(pydantic_object=CandidateModel)
        self.prompt = self._build_prompt_template()

    def _build_prompt_template(self):
        """
        Creates the prompt template for extracting candidate data.

        Returns:
            PromptTemplate: The template for the language model.
        """
        prompt_template = """\
        You are an experienced Human Resources manager tasked with
        extracting data from a resume for a {job_title} job and returning a JSON structure.

        Always complete the extraction. Never send partial responses. Ensure no duplicates in the Skills section.
        {format_instructions}

        Resume text: {resume_text}
        """
        return PromptTemplate(
            template=prompt_template,
            input_variables=["job_title", "resume_text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )

    async def _invoke_with_retries(self, resume_text: str, job_title: str):
        """
        Invokes the LLM with retry logic and exponential backoff.

        Args:
            resume_text (str): The raw resume text.
            job_title (str): The job title for which the resume is evaluated.

        Returns:
            dict: Parsed candidate data.

        Raises:
            Exception: If all retry attempts fail.
        """
        retries = 0
        delay = self.INITIAL_RETRY_DELAY

        while retries < self.MAX_RETRIES:
            try:
                llm_resume_parser = self.prompt | self.llm | self.parser

                # Asynchronously invoke the pipeline
                result = await asyncio.to_thread(
                    llm_resume_parser.invoke,
                    {"job_title": job_title, "resume_text": resume_text},
                )
                return result
            except Exception as e:
                retries += 1
                print(f"Error: {e}. Retrying ({retries}/{self.MAX_RETRIES})...")
                if retries < self.MAX_RETRIES:
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff
                else:
                    raise Exception(f"Failed to parse resume after {self.MAX_RETRIES} retries.") from e

    async def parse_resume(self, resume_text: str, job_title: str) -> CandidateModel:
        """
        Parses the resume text and extracts structured data as CandidateModel.

        Args:
            resume_text (str): The raw resume text.
            job_title (str): The job title for which the resume is evaluated.

        Returns:
            CandidateModel: Structured candidate data as per the CandidateModel schema.
        """
        try:
            result = await self._invoke_with_retries(resume_text, job_title)
            return result
        except Exception as e:
            print(f"Failed to parse resume: {e}")
            raise
