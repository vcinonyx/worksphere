from db.graph_data_handler import GraphDbHandler
from db.graph_data_insert import run_query, run_entity_relation_cypher, process_candidate_data_to_graph
from parsers.resume_parser import ResumeParser


class CandidateService:
    def __init__(self, job_parser: ResumeParser, graph_data_handler: GraphDbHandler):
        self.parser = job_parser
        self.dbHandler = graph_data_handler

    async def add_candidate(self, resume_text, job_title):
        """
        Add a candidate to the graph database based on the provided resume text and job title.

        Args:
            resume_text (str): The resume text of the candidate.
            job_title (str): The job title for which the candidate is being considered.

        Returns:
            None
        """
        candidate_data = await self.parser.parse_resume(resume_text, job_title)
        candidate_data_json = candidate_data.model_dump(mode='json')
        print(candidate_data_json)
        candidate_cypher = await process_candidate_data_to_graph([candidate_data_json])
        run_entity_relation_cypher(candidate_cypher)
        print(candidate_cypher)

    async def get_candidates(self, request=None):
        """
        Retrieve a list of candidates from the graph database.

        Args:
            request (Optional): Additional request parameters, if any.

        Returns:
            List[dict]: A list of candidate data represented as dictionaries.
        """
        candidates = run_query("""
        MATCH (person:Person)
        OPTIONAL MATCH (person)-[:HAS_POSITION]->(position:Position)
        OPTIONAL MATCH (position)-[:AT_COMPANY]->(company:Company)
        OPTIONAL MATCH (person)-[:HAS_SKILL]->(skill:Skill)
        OPTIONAL MATCH (person)-[:HAS_EDUCATION]->(education:Education)
        RETURN person.id AS PersonID,
               person.name AS Name,
               person.role AS Role,
               person.phoneNumber AS PhoneNumber,
               person.yearsOfExperience AS YearsOfExperience,
               person.email AS Email,
               person.description AS Description,
               person.educationDegree as EducationDegree,
               collect(DISTINCT {
                   positionID: position.id,
                   title: position.title,
                   location: position.location,
                   startDate: position.startDate,
                   endDate: position.endDate,
                   url: position.url,
                   company: company.name
               }) AS Positions,
               [skill IN collect(DISTINCT skill) WHERE skill.type IS NULL OR skill.type = "Hard" | skill.name] AS DefaultSkills,
               [skill IN collect(DISTINCT skill) WHERE skill.type = "Soft" | skill.name] AS SocialSkills,
               collect(DISTINCT {
                   educationID: education.id,
                   degreeType: education.degreeType,
                   major: education.major,
                   university: education.university,
                   graduationDate: education.graduationDate,
                   score: education.score,
                   url: education.url
               }) AS Education;
        """)

        return candidates.to_dict(orient='records')

    async def delete_candidate(self, candidate_id):
        """
        Delete a candidate from the graph database.

        Args:
            candidate_id (str): The ID of the candidate to delete.

        Returns:
            None
        """
        delete_query = f"""
        MATCH (person:Person {{id: '{candidate_id}'}})
        DETACH DELETE person
        """
        run_query(delete_query)
        print(f"Candidate with ID {candidate_id} has been deleted.")

