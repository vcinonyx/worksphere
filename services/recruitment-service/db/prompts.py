candidate_info_prompt = """
From the Resume text for a job candidate below, perform the following tasks:
0. Always complete the extraction. Never send partial responses. Extract All the skills present in the document, make sure no duplicates there!
If something is not present in the text it should never be added!

1. Extract the following entity types with the specified properties. Each entity must have a unique, alphanumeric `id`. Do not create new entity types beyond those specified:
    - Person: label:'Person', id:string, name:string, phoneNumber:string, email:string, role:string, description:string, yearsOfExperience:string, educationDegree:string//Description must be a summary of less than 100 characters.
    - Position: label:'Position', id:string, title:string, location:string, startDate:string, endDate:string, active:bool, description:stringg, url:string
    - Company: label:'Company', id:string, name:string
    - Skill: label:'Skill', id:string, name:string, type:string //Type can be Hard or Soft
    - Education: label:'Education', id:string, degreeType:string, major:string, university:string, graduationDate:string, score:string, url:string // degreeType should be BS/MS/PhD, education entity should be unique

2. Extract relationships based on the entity connections. Only create the specified relationship types:
    - person|HAS_POSITION|position
    - position|AT_COMPANY|company
    - person|HAS_SKILL|skill
    - person|HAS_EDUCATION|education
    - Any other relevant relationship patterns based on the entities available in the text.

3. Ensure not to impute missing values or create duplicate entities.
4. Focus should be solely on extracting entities related to the Person, Position, Company, Skill, and Education without merging or missing out on any category-specific details.

Example Output JSON:
{
    "entities": [
        {"label": "Person", "id": "person1", "role": "Software Engineer", name: "PersonName", "phoneNumber": "+380689995858", "yearsOfExperience":"5","email":"johndoe@gmail.com","description": "Experienced in multiple programming languages"},
        {"label": "Position", "id": "position1", "title": "Software Developer", "location": "New York", "startDate": "2019-01-01", "endDate": "2021-12-31", "url": ""},
        {"label": "Company", "id": "company1", "name": "Tech Innovations Inc"},
        {"label": "Skill", "id": "skill1", "name": "Java", "type":"Hard"},
        {"label": "Skill", "id": "skill2", "name": "Leadership", "type":"Soft"},
        {"label": "Education", "id": "education1", "degreeType": "BS", "major":"Computer Science","university": "MIT", "graduationDate": "2018", "score": "4.0", "url": ""}
    ],
    "relationships": [
        "person1|HAS_POSITION|position1",
        "position1|AT_COMPANY|company1",
        "person1|HAS_SKILL|skill1",
        "person1|HAS_EDUCATION|education1"
    ]
}

Question: Now, extract the entities and relationships as mentioned above for the text below -
$ctext

Answer:


"""

job_description_prompt = """
From the job description text for a position below, perform the following tasks:
0. Always complete the extraction. Never send partial responses. Extract all entities and relationships based on the job description text, ensuring that no relevant details are omitted.

1. Extract the following entity types with the specified properties. Each entity must have a unique, alphanumeric `id`. Do not create new entity types beyond those specified:
    - Job: label:string, id:string, title:string, preferredDegree:string, yearsOfExperience:int, description:string
    - Requirement: label:'Requirement', id:string, description:string
    - Skill: label:'Skill', id:string, name:string, type:string //Type can be Hard or Soft

2. Extract relationships based on the entity connections. Only create the specified relationship types:
    - job|HAS_REQUIREMENT|requirement
    - job|REQUIRES_SKILL|skill

3. Ensure not to impute missing values or create duplicate entities.
4. Focus solely on extracting entities related to the job title, requirements, and skills without merging or missing out on any category-specific details.

Example Output JSON:
{
    "entities": [
        {"label": "Job", "id": "job1", "title": "Software Engineer", 
        "preferredDegree": "MS", "yearsOfExperience": 5, "description": "Develop and maintain software applications"},
        {"label": "Requirement", "id": "req1", "description": "BS"},
        {"label": "Requirement", "id": "req2", "description": "5+ years of experience in software development"},
        {"label": "Requirement", "id": "req3", "description": "Proficiency in Python, JavaScript, and React"},
        {"label": "Skill", "id": "skill1", "name": "Python", "type": "Hard"},
        {"label": "Skill", "id": "skill2", "name": "JavaScript", "type": "Hard"},
        {"label": "Skill", "id": "skill3", "name": "React", "type": "Hard"},
        {"label": "Skill", "id": "skill4", "name": "Docker", "type": "Hard"},
        {"label": "Skill", "id": "skill5", "name": "Kubernetes", "type": "Hard"},
        {"label": "Skill", "id": "skill6", "name": "AWS", "type": "Hard"},
        {"label": "Skill", "id": "skill7", "name": "Software Architecture", "type": "Hard"},
        {"label": "Skill", "id": "skill8", "name": "Leadership", "type": "Soft"}
        
    ],
    "relationships": [
        "job1|HAS_REQUIREMENT|req1",
        "job1|HAS_REQUIREMENT|req2",
        "job1|HAS_REQUIREMENT|req3",
        "job1|REQUIRES_SKILL|skill1",
        "job1|REQUIRES_SKILL|skill2",
        "job1|REQUIRES_SKILL|skill3",
        "job1|REQUIRES_SKILL|skill4",
        "job1|REQUIRES_SKILL|skill5",
        "job1|REQUIRES_SKILL|skill6",
        "job1|REQUIRES_SKILL|skill7"
        "job1|REQUIRES_SKILL|skill8"
    ]
}

Question: Now, extract the entities and relationships as mentioned above for the job description text below -
$ctext

Answer:
"""