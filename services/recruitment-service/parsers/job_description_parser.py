import asyncio
import time

from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

from models import JobDescriptionModel


class JobDescriptionParser:

    MAX_RETRIES = 3  # Maximum number of retries
    INITIAL_RETRY_DELAY = 2  # Initial delay between retries in seconds

    def __init__(self, api_key: str, model_name: str = "llama3-8b-8192"):
        """
        Initializes the JobDescriptionParser with the language model.

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

        self.parser = PydanticOutputParser(pydantic_object=JobDescriptionModel)
        self.prompt = self._build_prompt_template()

    def _build_prompt_template(self):
        """
        Creates the prompt template for extracting job description data.

        Returns:
            PromptTemplate: The template for the language model.
        """
        prompt_template = """\
        You are tasked with extracting structured data from a job description and returning it as a JSON object.\n
        Always include all sections and ensure completeness. Avoid duplication. For social skills only key skills should be kept (1-2 words)\n
        {format_instructions}\n

        Job description text: {job_description_text}
        """
        return PromptTemplate(
            template=prompt_template,
            input_variables=["job_description_text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )

    async def _invoke_with_retries(self, job_description_text: str):
        """
        Invokes the LLM with retry logic and exponential backoff.

        Args:
            job_description_text (str): The raw job description text.

        Returns:
            dict: Parsed job description data.

        Raises:
            Exception: If all retry attempts fail.
        """
        retries = 0
        delay = self.INITIAL_RETRY_DELAY

        while retries < self.MAX_RETRIES:
            try:
                llm_job_description_parser = self.prompt | self.llm | self.parser

                # Asynchronously invoke the pipeline
                result = await asyncio.to_thread(
                    llm_job_description_parser.invoke,
                    {"job_description_text": job_description_text},
                )
                return result
            except Exception as e:
                retries += 1
                print(f"Error: {e}. Retrying ({retries}/{self.MAX_RETRIES})...")
                if retries < self.MAX_RETRIES:
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff
                else:
                    raise Exception(f"Failed to parse job description after {self.MAX_RETRIES} retries.") from e

    async def parse_job_description(self, job_description_text: str) -> JobDescriptionModel:
        """
        Parses the job description text and extracts structured data as JobDescriptionModel.

        Args:
            job_description_text (str): The raw job description text.

        Returns:
            JobDescriptionModel: Structured job description data as per the JobDescriptionModel schema.
        """
        try:
            result = await self._invoke_with_retries(job_description_text)
            return result
        except Exception as e:
            print(f"Failed to parse job description: {e}")
            raise
