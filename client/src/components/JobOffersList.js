import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form, Tab, Tabs } from "react-bootstrap";
import axios from "axios";

const JobOffersList = () => {
  const [jobs, setJobs] = useState([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [tabKey, setTabKey] = useState("structured");
  const [newJob, setNewJob] = useState({
    Title: "",
    PreferredDegree: "",
    YearsOfExperience: "",
    Description: "",
    DefaultSkills: [],
    SocialSkills: [],
  });
  const [unstructuredText, setUnstructuredText] = useState("");
  const history = useHistory();

  const theme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "10px 10px 10px 10px",
        },
      },
    },
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/jobs"); // Replace with your API URL
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs.");
    }
  };

  const handleView = (jobId) => {
    history.push({
      pathname: "/joboffer-details/",
      state: { jobId },
    });
  };

  const handleDelete = async (jobId) => {
    if (window.confirm(`Are you sure you want to delete this job?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/jobs/${jobId}`); // Replace with your API URL
        setJobs((prevJobs) => prevJobs.filter((job) => job.JobID !== jobId));
        alert("Job deleted successfully.");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job.");
      }
    }
  };

  const handleAddJob = async () => {
    try {
      if (tabKey === "structured") {
        const response = await axios.post("http://localhost:8000/api/jobs", newJob); // Replace with your API URL
        setJobs((prevJobs) => [...prevJobs, response.data]);
      } else {
        const generatedJob = {
          Title: "Unstructured Job",
          PreferredDegree: "N/A",
          YearsOfExperience: "N/A",
          Description: unstructuredText,
          DefaultSkills: [],
          SocialSkills: [],
        };
        const response = await axios.post("http://localhost:8000/api/jobs", generatedJob); // Replace with your API URL
        setJobs((prevJobs) => [...prevJobs, response.data]);
      }
      setShowAddJobModal(false);
      setNewJob({
        Title: "",
        PreferredDegree: "",
        YearsOfExperience: "",
        Description: "",
        DefaultSkills: [],
        SocialSkills: [],
      });
      setUnstructuredText("");
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job.");
    }
  };

  return (
      <div className="container-fluid pt-4">
        <h4>
          <Button variant="primary" onClick={() => setShowAddJobModal(true)}>
            Add Job Offer
          </Button>
        </h4>
        <div className="col-sm-12">
          <ThemeProvider theme={theme}>
            <MaterialTable
                columns={[
                  { title: "Job ID", field: "JobID", width: "20%" },
                  { title: "Title", field: "Title", width: "15%" },
                  { title: "Degree", field: "PreferredDegree", width: "10%" },
                  { title: "Experience", field: "YearsOfExperience", width: "10%" },
                  {
                    title: "Description",
                    field: "Description",
                    render: (rowData) => (
                        <span title={rowData.Description}>
                    {rowData.Description.length > 50
                        ? `${rowData.Description.substring(0, 50)}...`
                        : rowData.Description}
                  </span>
                    ),
                  },
                  {
                    title: "Actions",
                    render: (rowData) => (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleView(rowData.JobID)}
                          >
                            View
                          </button>
                          <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(rowData.JobID)}
                          >
                            Delete
                          </button>
                        </div>
                    ),
                  },
                ]}
                data={jobs}
                options={{
                  pageSize: 5,
                  pageSizeOptions: [5, 10],
                  rowStyle: (_, index) => ({
                    backgroundColor: index % 2 ? "#f9f9f9" : "#ffffff",
                  }),
                  headerStyle: {
                    backgroundColor: "#515e73",
                    color: "#FFF",
                  },
                  tableLayout: "fixed",
                }}
                title="Job Offers"
            />
          </ThemeProvider>
        </div>

        <Modal show={showAddJobModal} onHide={() => setShowAddJobModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Job Offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
                id="add-job-tabs"
                activeKey={tabKey}
                onSelect={(k) => setTabKey(k)}
                className="mb-3"
            >
              <Tab eventKey="structured" title="Structured Form">
                <Form>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        name="Title"
                        value={newJob.Title}
                        onChange={(e) =>
                            setNewJob({ ...newJob, Title: e.target.value })
                        }
                    />
                  </Form.Group>

                  <Form.Group controlId="formPreferredDegree">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control
                        as="select"
                        name="PreferredDegree"
                        value={newJob.PreferredDegree}
                        onChange={(e) =>
                            setNewJob({ ...newJob, PreferredDegree: e.target.value })
                        }
                    >
                      <option value="">Choose...</option>
                      <option value="None">None</option>
                      <option value="BS">BS</option>
                      <option value="MS">MS</option>
                      <option value="PhD">PhD</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formYearsOfExperience">
                    <Form.Label>Experience</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Years of Experience"
                        name="YearsOfExperience"
                        value={newJob.YearsOfExperience}
                        onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              YearsOfExperience: e.target.value,
                            })
                        }
                    />
                  </Form.Group>

                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter Description"
                        name="Description"
                        value={newJob.Description}
                        onChange={(e) =>
                            setNewJob({ ...newJob, Description: e.target.value })
                        }
                    />
                  </Form.Group>
                </Form>
              </Tab>
              <Tab eventKey="unstructured" title="Unstructured Text">
                <Form.Group controlId="formUnstructuredText">
                  <Form.Label>Unstructured Text</Form.Label>
                  <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Paste job description here"
                      value={unstructuredText}
                      onChange={(e) => setUnstructuredText(e.target.value)}
                  />
                </Form.Group>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddJobModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddJob}>
              Save Job
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default JobOffersList;
