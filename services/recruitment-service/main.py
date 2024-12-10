from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.candidate import CandidateService
from services.job_description import JobDescriptionService

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResumeExtractionRequest(BaseModel):
    resume_text: str
    job_title: str


class ResumeExtractionResponse(BaseModel):
    extracted_data: str


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/extract-resume-data", response_model=ResumeExtractionResponse)
async def extract_resume_data(request: ResumeExtractionRequest):
    """
    API endpoint to extract structured data from a resume for a specific job title.
    """
    try:
        extracted_data = await CandidateService.add_candidate(request.resume_text, request.job_title)
        return {"extracted_data": extracted_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs")
async def add_job(job_description: str):
    try:
        await JobDescriptionService.add_job_description(job_description)
        return {"message": "Job description added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/jobs")
async def get_jobs():
    try:
        jobs = JobDescriptionService.get_job_descriptions()
        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    try:
        job = await JobDescriptionService.get_job_description(job_id)
        return {"job": job}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Job not found")


@app.put("/jobs/{job_id}")
async def update_job(job_id: str, data: dict):
    try:
        await JobDescriptionService.update_job_description(job_id, data)
        return {"message": "Job description updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    try:
        await JobDescriptionService.delete_job_description(job_id)
        return {"message": "Job description deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/jobs/{job_id}/top-candidates/{num}")
async def get_top_candidates(
        job_id: str,
        num: int,
        skills_match: Optional[float] = Query(0.5, description="Weight for skills match"),
        experience_match: Optional[float] = Query(0.2, description="Weight for experience match"),
        education_match: Optional[float] = Query(0.2, description="Weight for education match"),
        social_skills_match: Optional[float] = Query(0.1, description="Weight for social skills match"),
):
    try:
        custom_weights = {
            "skills_match": skills_match,
            "experience_match": experience_match,
            "education_match": education_match,
            "social_skills_match": social_skills_match,
        }

        candidates = await JobDescriptionService.get_top_matching_candidates(job_id, num, custom_weights)
        return {"candidates": candidates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/candidates")
async def get_job_candidates():
    try:
        candidates = await CandidateService.get_candidates()
        return {"candidates": candidates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/candidates/")
async def add_job_candidate(resume_text: str, job_title: str):
    try:
        await CandidateService.add_candidate(resume_text, job_title)
        return {"message": "Candidate added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/candidates/{candidate_id}")
async def delete_candidate(candidate_id: str):
    try:
        await CandidateService.delete_candidate(candidate_id)
        return {"message": "Candidate deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
