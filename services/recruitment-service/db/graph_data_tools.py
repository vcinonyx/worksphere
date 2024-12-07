import json
from string import Template

import pandas as pd
from neo4j import GraphDatabase
from openai import AsyncOpenAI
from retry import retry
from prompts import job_description_prompt, candidate_info_prompt


class GraphGPTHandler:
    def __init__(self, connection_url, username, password, api_key):
        """
        Initialize the GraphGPTHandler with Neo4j connection and OpenAI settings.

        Args:
            connection_url (str): Neo4j database connection URL.
            username (str): Neo4j username.
            password (str): Neo4j password.
            api_key (str): OpenAI API key.
        """

        self.driver = GraphDatabase.driver(connection_url, auth=(username, password))
        self.driver.verify_connectivity()
        self.client = AsyncOpenAI(api_key=api_key)
        self.candidate_info_prompt = self._load_candidate_prompt()
        self.job_description_prompt = self._load_job_description_prompt()

    def close(self):
        """Close the Neo4j driver connection."""
        self.driver.close()

    @staticmethod
    def _load_candidate_prompt():
        """Load the candidate information prompt."""
        return candidate_info_prompt

    @staticmethod
    def _load_job_description_prompt():
        """Load the job description prompt."""
        return job_description_prompt

    @retry(tries=2, delay=5)
    async def _process_gpt(self, system, prompt):
        """Process GPT request with retry logic."""
        completion = await self.client.chat.completions.create(model="gpt-4o", messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ])
        return completion.choices[0].message.content

    async def _run_completion(self, prompt_template, ctext):
        """Run the GPT completion with formatted input."""
        try:
            system = ("You are a helpful HR experienced professional expert who extracts relevant information and "
                      "stores it in a Neo4j Knowledge Graph.")
            formatted_prompt = Template(prompt_template).substitute(ctext=ctext)
            print(f"Formatted Prompt: {formatted_prompt}")
            res = await self._process_gpt(system, formatted_prompt)
            return json.loads(res.replace("'", '"'))
        except Exception as e:
            print(f"Error in _run_completion: {e}")

    async def process_candidate_data_to_graph(self, records):
        """Process candidate records into graph-compatible data."""
        results = []
        for record in records:
            result = await self._run_completion(self.candidate_info_prompt, record)
            if result is not None:
                results.append(result)
        return results

    async def process_job_description_data_to_graph(self, records):
        """Process job description records into graph-compatible data."""
        results = []
        for record in records:
            result = await self._run_completion(self.job_description_prompt, record)
            if result is not None:
                results.append(result)
        return results

    def run_query(self, query, params=None):
        """Run a Cypher query on the Neo4j database."""
        params = params or {}
        try:
            with self.driver.session() as session:
                result = session.run(query, params)
                return pd.DataFrame([r.values() for r in result], columns=result.keys())
        except Exception as e:
            print(f"Error in run_query: {e}")
            return pd.DataFrame()