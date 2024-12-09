DEFAULT_CRITERIA_WEIGHTS = {
    'skills_match': 0.5,
    'experience_match': 0.2,
    'education_match': 0.2,
    'social_skills_match': 0.1,
}

DEGREE_PRECEDENCE = {"BS": 1, "MS": 2, "PhD": 3}


class CandidateEvaluationService:
    def __init__(self, weights=None):
        """
        Initialize the CandidateEvaluationService.

        Args:
            weights (dict): Criteria weights for evaluation. Default to DEFAULT_CRITERIA_WEIGHTS.
        """
        self.weights = weights or DEFAULT_CRITERIA_WEIGHTS
        self.degree_precedence = DEGREE_PRECEDENCE

    @staticmethod
    def calculate_skills_match(candidate_skills, job_skills):
        """Calculate the percentage of job skills that the candidate possesses."""
        if not job_skills:
            return 1  # No specific skills required
        matched_skills = set(candidate_skills) & set(job_skills)
        return len(matched_skills) / len(job_skills)

    @staticmethod
    def calculate_experience_match(candidate_experience, job_experience_required):
        """Check if the candidate meets or exceeds the required years of experience."""
        if job_experience_required is None:
            return 1  # No specific experience required
        return min(candidate_experience / job_experience_required, 1)

    def calculate_education_match(self, candidate_degrees, job_preferred_degree):
        """
        Calculate the education match score.
        Return 1 if the candidate's degree matches or exceeds the job's preferred degree.
        """
        if job_preferred_degree is None:
            return 1

        job_degree_rank = self.degree_precedence.get(job_preferred_degree.upper(), 0)

        for degree in candidate_degrees:
            candidate_degree_rank = self.degree_precedence.get(degree.upper(), 0)
            if candidate_degree_rank >= job_degree_rank:
                return 1

        return 0

    @staticmethod
    def calculate_social_skills_match(candidate_social_skills, job_social_skills):
        """Calculate the match for social skills, ignoring case."""
        if not job_social_skills:
            return 1
        if not candidate_social_skills:
            return 0

        candidate_skill_set = set(skill.lower() for skill in candidate_social_skills)
        job_skill_set = set(skill.lower() for skill in job_social_skills)
        matched_skills = candidate_skill_set & job_skill_set
        return len(matched_skills) / len(job_skill_set)

    def calculate_match_score(self, candidate, job):
        """
        Calculate the overall match score between a candidate and a job.

        Args:
            candidate (dict): Candidate's details.
            job (dict): Job's requirements.

        Returns:
            dict: Match scores breakdown and total score.
        """
        candidate_skills = candidate.get('candidate_skills', [])
        candidate_experience = candidate.get('candidate_experience', 0)
        candidate_degrees = candidate.get('candidate_degree', [])
        candidate_social_skills = candidate.get('candidate_social_skills', [])

        job_skills = job.get('job_skills', [])
        job_experience_required = job.get('job_experience_required', 0)
        job_preferred_degree = job.get('job_preferred_degree', "Unknown")
        job_social_skills = job.get('job_social_skills', [])

        skills_match_score = self.calculate_skills_match(candidate_skills, job_skills)
        experience_match_score = self.calculate_experience_match(candidate_experience, job_experience_required)
        education_match_score = self.calculate_education_match(candidate_degrees, job_preferred_degree)
        social_skills_match_score = self.calculate_social_skills_match(candidate_social_skills, job_social_skills)

        total_score = (
                self.weights['skills_match'] * skills_match_score +
                self.weights['experience_match'] * experience_match_score +
                self.weights['education_match'] * education_match_score +
                self.weights['social_skills_match'] * social_skills_match_score
        )

        return {
            "skills_match": {"score": round(skills_match_score, 2)},
            "experience_match": {"score": round(experience_match_score, 2)},
            "education_match": {"score": round(education_match_score, 2)},
            "social_skills_match": {"score": round(social_skills_match_score, 2)},
            "total_score": round(total_score, 2)
        }

    def match_candidates_to_jobs(self, candidates, jobs):
        """
        Match candidates to job descriptions and rank them based on match score.

        Args:
            candidates (list): List of candidate dictionaries.
            jobs (list): List of job dictionaries.

        Returns:
            dict: Mapping of job identifiers to ranked candidates.
        """
        job_matches = {}
        for job in jobs:
            scores = []
            for candidate in candidates:
                results = self.calculate_match_score(candidate, job)
                scores.append({'candidate': candidate, 'score': results['total_score'], 'results': results})

            ranked_candidates = sorted(scores, key=lambda x: x['score'], reverse=True)
            job_matches[job['job_id']] = ranked_candidates
        return job_matches

    def get_top_candidates(self, candidates, job, num_candidates=5):
        """
        Get the top candidates for a given job based on match scores.

        Args:
            candidates (list): List of candidate dictionaries.
            job (dict): Job description dictionary.
            num_candidates (int): Number of top candidates to return. Default is 5.

        Returns:
            list: Top candidates with match scores.
        """
        scores = []
        for candidate in candidates:
            results = self.calculate_match_score(candidate, job)
            scores.append({
                'candidate': candidate['candidate'],
                'score': round(results['total_score'], 2),
                'results': results
            })

        ranked_candidates = sorted(scores, key=lambda x: x['score'], reverse=True)
        return ranked_candidates[:num_candidates]
