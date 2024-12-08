import asyncio

from parsers.resume_parser import extract_data_from_resume_text
from parsers.job_description_parser import extract_data_from_job_description
from db.graph_data_insert import process_candidate_data_to_graph, process_job_description_data_to_graph, \
    run_entity_relation_cypher, get_skills


async def main():
    # Test inputs for the candidates
    resume_text_1 = """
    Ivan Ivanov
Kyiv, Ukraine | +380 63 123 4567 | ivan.ivanov@example.com
Technical Skills
Programming Languages: Python, JavaScript
Frameworks and Libraries: React, Node.js
Tools: Docker, Kubernetes, AWS, Git
Other Skills: Software architecture, RESTful API design
Social Skills
Leadership
Communication
Teamwork
Work Experience
Software Engineer
TechNova Solutions, Kyiv, Ukraine
March 2018 – Present

Education: Master degree KPI 2022 Computer Science
    """

    resume_text_2 = """
    Jane Smith
    +380689996969
    janesmith@domain.com
    Senior Software Engineer with 7+ years of experience in backend development and cloud computing. Specialized in Java, Kubernetes, and AWS. Adept at leading projects and collaborating with cross-functional teams to deliver results.

    Experience:
    - Senior Developer at CloudSolutions (2016-2023): Designed and implemented scalable backend systems.
    - Developer at CodeFactory (2013-2016): Worked on RESTful APIs and improved database performance.

    Education:
    - M.Sc. in Computer Science, Tech University, 2013-2015.

    Skills:
    - Programming: Java, Kubernetes, AWS, SQL, Microservices
    - Soft Skills: Leadership, Problem-solving, Communication
    """

    job_title = "Software Engineer"

    job_description_text = """
    Position: Software Engineer
    Location: Remote
    Company: Tech Innovators Inc.

    Responsibilities:
    - Design and develop scalable web applications.
    - Collaborate with cross-functional teams to define, design, and ship new features.
    - Write clean, maintainable code and conduct code reviews.

    Requirements:
    - Master's degree in Computer Science or related field.
    - Proficiency in Python, JavaScript, and React.
    - Experience with Docker, Kubernetes, and AWS.
    - Strong understanding of software architecture and design patterns.

    Preferred Social Skills:
    - Strong communication skills for effective collaboration.
    - Leadership abilities to guide team members.
    """

    # Call async functions to extract data for both candidates
    resume_data_1 = await extract_data_from_resume_text(resume_text_1, job_title)
    resume_data_1_json = resume_data_1.model_dump(mode='json')
    print("Extracted Resume Data for Candidate 1:")
    print(resume_data_1)
    print(resume_data_1_json)

    # resume_data_2 = await extract_data_from_resume_text(resume_text_2, job_title)
    # resume_data_2_json = resume_data_2.model_dump(mode='json')
    # print("Extracted Resume Data for Candidate 2:")
    # print(resume_data_2)
    #
    candidate_cypher = await process_candidate_data_to_graph([resume_text_1])
    print(candidate_cypher)

    run_entity_relation_cypher(candidate_cypher)

    # Call async function to extract job description data
    # job_data = await extract_data_from_job_description(job_description_text)
    # print("Extracted Job Description Data:")
    # print(job_data)
    #
    # job_cypher = await process_job_description_data_to_graph([job_data])
    # print(job_cypher)
    #
    # run_entity_relation_cypher(job_cypher)
    #
    # Perform matching
    # matches = match_candidates_to_jobs([resume_data_1, resume_data_2], [job_data])
    #
    # Display the match results
    # print("\nMatch Results:")
    # for job_title, ranked_candidates in matches.items():
    #     print(f"\nJob: {job_title}")
    #     print(ranked_candidates)
    #     for rank, item in enumerate(ranked_candidates, start=1):
    #         candidate = item['candidate']
    #         score = item['score']
    #         print(f"{rank}. {candidate.first_name} {candidate.last_name} - Match Score: {score:.2f}")


# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())
