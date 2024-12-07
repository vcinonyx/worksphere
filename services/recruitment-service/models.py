from typing import List, Optional

from pydantic import BaseModel, Field


class Date(BaseModel):
    """Date"""
    day: Optional[int] = Field(default=1,
                               description="Day of month, a integer from 1 and 31, if unkown the default is 1")
    month: Optional[int] = Field(description="Month of year, an integer from 1 to 12")
    year: Optional[int] = Field(description="Year in yyyy format")


class JobModel(BaseModel):
    """Job details"""
    job_title: Optional[str] = Field(description="Job title")
    job_description: Optional[str] = Field(
        description="Information about the job and what did the candidate do in it if available.")
    started_at: Optional[Date] = Field(
        description="When did the candidate start this job? Retrun None if not available")
    ended_at: Optional[Date] = Field(description="When did the candidate end this job? Retrun None if not available")
    current_job: Optional[bool] = Field(
        description="True if this the candidates current job, False if it's not the candidate's current job")


class DegreeModel(BaseModel):
    """degree details, which only includes Bachelor's, Master's or Phd degrees, use only BS, MS, PhD"""
    degree_type: Optional[str] = Field(
        description="Degree type. Use only BS for Bachelor's, only MS for Master, and PhD")
    major: Optional[str] = Field(description="Degree major")
    university: Optional[str] = Field(description="Degree university")
    graduation_date: Optional[Date] = Field(description="When did the candidate graduate? Retrun None if not available")


class SkillModel(BaseModel):
    name: str = Field(
        description="Hard or soft skills of candidate. Generally in 1-2-3 words. Only most important parts should be kept, skip extra words such as ```knowledge``` ```experience``` and others")
    type: str = Field(description="Hard of soft skill")


class CandidateModel(BaseModel):
    """personal information about the candidate"""
    first_name: Optional[str] = Field(description="First name")
    last_name: Optional[str] = Field(description="Last name")
    phone_number: Optional[str] = Field(description="Phone number with country phone code")
    years_of_experience: Optional[int] = Field(description="Years of experience")
    email: Optional[str] = Field(description="Email address")
    country: Optional[str] = Field(description="country")
    degrees: Optional[List[DegreeModel]] = Field(description="list of all candidate's degrees")
    jobs: Optional[List[JobModel]] = Field(
        description="Only include jobs the candidate listed in a work experience section. Return None if hasn't listed any.")
    soft_skills: List[str] = Field(
        description="List of extracted social or soft skills, such as communication, teamwork, and problem-solving")
    skills: Optional[list[SkillModel]] = Field(description="list of candidate's skills that are relevant to the job")
    summary: Optional[str] = Field(description="Candidate's summary")


class JobDescriptionModel(BaseModel):
    """Job description"""
    title: str = Field(description="Job title, e.g., 'Software Engineer'")
    preferred_degree: Optional[str] = Field(description="Preferred degree, use only 'BS', 'MS', 'PhD'")
    # responsibilities: List[str] = Field(
    #     description="List of job responsibilities, e.g., ['Develop web applications', 'Write clean code']")
    requirements: List[str] = Field(description="List of job requirements, e.g., ['BS', 'Proficiency in Python']")
    preferred_skills: Optional[List[SkillModel]] = Field(
        default=None,
        description="List of skills required by the job, e.g., ['AWS', 'Docker']. No duplicates, keep them short 1 skill must be 1 value, don't give them comma separated"
    )
    social_skills: List[str] = Field(
        description="List of extracted social or soft skills, only key words must be kept (1 or 2 words) such as communication, teamwork, and problem-solving")
    years_of_experience: Optional[int] = Field(
        default=1,
        description="Required years of experience for the job, e.g., 3. If not mentioned put 1"
    )
