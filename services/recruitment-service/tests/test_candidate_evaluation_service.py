import unittest

from services.candidate_evaluation import CandidateEvaluationService


class TestCandidateEvaluationService(unittest.TestCase):
    def setUp(self):
        self.service = CandidateEvaluationService()

        self.candidate_1 = {
            "candidate_skills": ["Python", "Docker", "AWS"],
            "candidate_experience": 5,
            "candidate_degree": ["MS"],
            "candidate_social_skills": ["Leadership", "Communication"]
        }

        self.candidate_2 = {
            "candidate_skills": ["Java", "Kubernetes"],
            "candidate_experience": 3,
            "candidate_degree": ["BS"],
            "candidate_social_skills": ["Teamwork"]
        }

        self.job = {
            "job_id": "job1",
            "job_skills": ["Python", "Docker", "AWS"],
            "job_experience_required": 4,
            "job_preferred_degree": "BS",
            "job_social_skills": ["Leadership", "Communication"]
        }

    def test_calculate_skills_match(self):
        result = self.service.calculate_skills_match(self.candidate_1["candidate_skills"], self.job["job_skills"])
        self.assertEqual(result, 1.0, "Candidate 1 should match all job skills")

        result = self.service.calculate_skills_match(self.candidate_2["candidate_skills"], self.job["job_skills"])
        self.assertAlmostEqual(result, 0.0, "Candidate 2 should not match any job skills")

    def test_calculate_experience_match(self):
        result = self.service.calculate_experience_match(self.candidate_1["candidate_experience"],
                                                         self.job["job_experience_required"])
        self.assertEqual(result, 1.0, "Candidate 1 meets or exceeds experience requirement")

        result = self.service.calculate_experience_match(self.candidate_2["candidate_experience"],
                                                         self.job["job_experience_required"])
        self.assertAlmostEqual(result, 0.75, "Candidate 2 should match 75% of experience requirement")

    def test_calculate_education_match(self):
        result = self.service.calculate_education_match(self.candidate_1["candidate_degree"],
                                                        self.job["job_preferred_degree"])
        self.assertEqual(result, 1.0, "Candidate 1 should meet the education requirement")

        result = self.service.calculate_education_match(self.candidate_2["candidate_degree"], "MS")
        self.assertEqual(result, 0.0, "Candidate 2 should not meet the MS education requirement")

    def test_calculate_social_skills_match(self):
        result = self.service.calculate_social_skills_match(self.candidate_1["candidate_social_skills"],
                                                            self.job["job_social_skills"])
        self.assertEqual(result, 1.0, "Candidate 1 matches all social skills")

        result = self.service.calculate_social_skills_match(self.candidate_2["candidate_social_skills"],
                                                            self.job["job_social_skills"])
        self.assertAlmostEqual(result, 0.0, "Candidate 2 does not match job social skills")

    def test_calculate_match_score(self):
        # Test overall match score
        result = self.service.calculate_match_score(self.candidate_1, self.job)
        self.assertEqual(result["total_score"], 1.0, "Candidate 1 should have a perfect match score")

        result = self.service.calculate_match_score(self.candidate_2, self.job)
        self.assertLess(result["total_score"], 0.5, "Candidate 2 should have a lower match score")

if __name__ == "__main__":
    unittest.main()
