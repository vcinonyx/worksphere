from typing import List

from db.graph_data_handler import GraphDbHandler
from db.graph_data_insert import process_job_description_data_to_graph, run_entity_relation_cypher, run_query
from models import JobDescriptionModel
from parsers.job_description_parser import JobDescriptionParser
from services.candidate_evaluation import CandidateEvaluationService


class JobDescriptionService:
    def __init__(self, job_parser: JobDescriptionParser, graph_data_handler: GraphDbHandler):
        self.parser = job_parser
        self.db_handler = graph_data_handler
        self.candidate_evaluation_service = CandidateEvaluationService()

    async def add_job_description(self, job_text: str):
        """
        Add a job description to the graph database.

        Args:
            job_text (str): The raw text of the job description.
        """
        job_data = await self.parser.parse_job_description(job_text)
        await self.process_job_to_graph(job_data)

    def get_job_descriptions(self):
        """
        Retrieve all job descriptions from the database.

        Returns:
            List[JobDescriptionModel]: A list of job descriptions.
        """
        query = """
        MATCH (job:Job)
        OPTIONAL MATCH (job)-[:HAS_REQUIREMENT]->(req:Requirement)
        OPTIONAL MATCH (job)-[:REQUIRES_SKILL]->(skill:Skill)
        RETURN job.id AS JobID, 
               job.title AS Title, 
               job.preferredDegree AS PreferredDegree, 
               job.yearsOfExperience AS YearsOfExperience, 
               job.description AS Description,
               collect(DISTINCT req.description) AS Requirements,
               [skill IN collect(DISTINCT skill) WHERE skill.type IS NULL OR skill.type = "Hard" | skill.name] AS DefaultSkills,
               [skill IN collect(DISTINCT skill) WHERE skill.type = "Soft" | skill.name] AS SocialSkills
        """
        data = run_query(query)
        return data.to_dict(orient="records")

    def get_job_description_by_id(self, job_id: str) -> JobDescriptionModel:
        """
        Retrieve a job description by its ID.

        Args:
            job_id (str): The ID of the job.

        Returns:
            JobDescriptionModel: The job description model.
        """
        query = f"""
        MATCH (job:Job {{id: '{job_id}'}})
        OPTIONAL MATCH (job)-[:HAS_REQUIREMENT]->(req:Requirement)
        OPTIONAL MATCH (job)-[:REQUIRES_SKILL]->(skill:Skill)
        RETURN job.id AS JobID, 
               job.title AS Title, 
               job.preferredDegree AS PreferredDegree, 
               job.yearsOfExperience AS YearsOfExperience, 
               job.description AS Description,
               collect(DISTINCT req.description) AS Requirements,
               [skill IN collect(DISTINCT skill) WHERE skill.type IS NULL OR skill.type = "Hard" | skill.name] AS DefaultSkills,
               [skill IN collect(DISTINCT skill) WHERE skill.type = "Soft" | skill.name] AS SocialSkills
        """
        data = run_query(query)
        record = data.to_dict(orient="records")[0]
        return JobDescriptionModel(**record)

    def update_job_description(self, job_id: str, data: dict):
        """
        Update a job description in the graph database.

        Args:
            job_id (str): The ID of the job.
            data (dict): The data to update.
        """
        query = f"""
        MATCH (job:Job {{id: '{job_id}'}})
        SET job += $data
        RETURN job
        """
        run_query(query, params={"data": data})

    def delete_job_description(self, job_id: str):
        """
        Delete a job description from the graph database.

        Args:
            job_id (str): The ID of the job to delete.
        """
        query = f"""
        MATCH (job:Job {{id: '{job_id}'}})
        DETACH DELETE job
        """
        run_query(query)

    async def process_job_to_graph(self, job_data: JobDescriptionModel):
        """
        Process job data and store it in the graph database.

        Args:
            job_data (JobDescriptionModel): The job description data.
        """
        job_cypher = await process_job_description_data_to_graph([job_data])
        run_entity_relation_cypher(job_cypher)

    @staticmethod
    def candidate_entity_to_model(candidate):
        candidate_skills = candidate.get("DefaultSkills", [])
        candidate_experience = int(candidate.get("YearsOfExperience", 0))
        candidate_degree = candidate.get("EducationDegree", "BS")
        if not candidate_degree:
            candidate_degree = "BS"
        candidate_social_skills = candidate.get("SocialSkills", [])

        return {
            'candidate_skills': candidate_skills,
            'candidate_experience': candidate_experience,
            'candidate_degree': [candidate_degree],
            'candidate_social_skills': candidate_social_skills,
            'candidate': candidate
        }

    @staticmethod
    def job_entity_to_model(job):
        job_skills = job.get("DefaultSkills", [])
        job_experience_required = int(job.get("YearsOfExperience", 0))
        job_preferred_degree = job.get("PreferredDegree", "Unknown")
        job_social_skills = job.get("SocialSkills", [])

        return {
            'job_skills': job_skills,
            'job_experience_required': job_experience_required,
            'job_preferred_degree': job_preferred_degree,
            'job_social_skills': job_social_skills,
        }
