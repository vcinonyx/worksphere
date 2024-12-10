import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Modal, Button, Form } from "react-bootstrap";

const JobOfferDetails = ({ location }) => {
  const [jobId, setJobId] = useState(location.state?.jobId ?? "job2");
  const [jobDetails, setJobDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [weights, setWeights] = useState({
    skills_match: 0.5,
    experience_match: 0.2,
    education_match: 0.2,
    social_skills_match: 0.1,
  });
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showWeightsSection, setShowWeightsSection] = useState(false);

  useEffect(() => {
    // Fetch job details and candidates from API
    const fetchJobDetails = async () => {
      try {
        // Mocked job details for now
        const mockedJobDetails = {
          JobID: "job1",
          Title: "Software Engineer",
          PreferredDegree: "MS",
          YearsOfExperience: "5",
          Description: "Develop and maintain software applications",
          DefaultSkills: ["AWS", "Docker", "Kubernetes", "Python", "JavaScript", "React"],
          SocialSkills: ["Communication", "Leadership", "Teamwork"],
        };
        setJobDetails(mockedJobDetails);

        const response = await fetch("http://localhost:8000/candidates", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCandidates(data.candidates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJobDetails();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("jobId", jobId);

    alert("Resume uploaded successfully.");
    setSelectedFile(null);
  };

  const handleWeightChange = (field, value) => {
    setWeights((prevWeights) => ({
      ...prevWeights,
      [field]: parseFloat(value),
    }));
  };

  const fetchTopCandidates = async () => {
    try {
      const url = new URL(`http://localhost:8000/jobs/${jobId}/top-candidates/5`);
      Object.entries(weights).forEach(([key, value]) => url.searchParams.append(key, value));

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching top candidates:", error);
      alert("Failed to fetch top candidates. Please try again.");
    }
  };

  if (!jobDetails) return <div>Loading...</div>;

  return (
      <div className="mb-4">
        <h5>Job Details</h5>
        <table
            className="table table-bordered table-striped table-hover"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
        >
          <tbody>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1", width: "200px" }}>Job ID</th>
            <td>{jobDetails.JobID}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Title</th>
            <td>{jobDetails.Title}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Preferred Degree</th>
            <td>{jobDetails.PreferredDegree}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Years of Experience</th>
            <td>{jobDetails.YearsOfExperience}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Description</th>
            <td>{jobDetails.Description}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Technical Skills</th>
            <td>{jobDetails.DefaultSkills.join(", ")}</td>
          </tr>
          <tr>
            <th style={{ backgroundColor: "#f1f1f1" }}>Social Skills</th>
            <td>{jobDetails.SocialSkills.join(", ")}</td>
          </tr>
          </tbody>
        </table>

        {/* Buttons Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <button
              className="btn btn-secondary"
              onClick={() => setShowUploadSection(!showUploadSection)}
          >
            {showUploadSection ? "Hide Upload Section" : "Upload Resume"}
          </button>
          <button
              className="btn btn-secondary"
              onClick={() => setShowWeightsSection(!showWeightsSection)}
          >
            {showWeightsSection ? "Hide Weights Section" : "Adjust Weights"}
          </button>
          <button className="btn btn-primary" onClick={fetchTopCandidates}>
            Search Top Candidates
          </button>
        </div>

        {/* Expandable Upload Resume Section */}
        {showUploadSection && (
            <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ced4da",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
            >
              <h5>Upload Resume</h5>
              <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="form-control mb-2"
              />
              <button
                  onClick={handleFileUpload}
                  className="btn btn-primary"
                  disabled={!selectedFile}
              >
                Upload
              </button>
            </div>
        )}

        {/* Expandable Weights Section */}
        {showWeightsSection && (
            <div style={{ padding: "20px", backgroundColor: "#f8f9fa", border: "1px solid #ced4da", borderRadius: "8px" }}>
              <h5>Adjust Weights</h5>
              {Object.entries(weights).map(([key, value]) => (
                  <div className="mb-3" key={key}>
                    <label>{key.replace("_", " ").toUpperCase()}</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleWeightChange(key, e.target.value)}
                        className="form-control"
                        step="0.1"
                        min="0"
                        max="1"
                    />
                  </div>
              ))}
            </div>
        )}

        {/* Candidates Table */}
        <h5>Candidates</h5>
        <MaterialTable
            columns={[
              { title: "Name", field: "Name" },
              { title: "Score", field: "score" },
              { title: "Role", field: "Role" },
              { title: "Experience Years", field: "YearsOfExperience" },
              { title: "Degree", field: "EducationDegree" },
              { title: "Email", field: "Email" },
            ]}
            data={candidates.map(candidate => ({
              ...candidate.candidate,
              score: candidate.score,
            }))}
            options={{
              pageSize: 5,
              pageSizeOptions: [5, 10],
            }}
            title="Candidates for this Job Offer"
        />
      </div>
  );
};

export default JobOfferDetails;
