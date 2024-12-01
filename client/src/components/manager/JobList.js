import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Dropdown } from "react-bootstrap";
import MaterialTable from "material-table";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import axios from "axios";
import moment from "moment";

const JobList = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showAddModel, setShowAddModel] = useState(false);

  useEffect(() => {
    // Fetch departments
    axios
        .get("/api/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setDepartments(res.data);
        })
        .catch(console.error);

    // Fetch jobs for the default department
    fetchJobs();
  }, []);

  const fetchJobs = (departmentId = null) => {
    const deptId = departmentId || JSON.parse(localStorage.getItem("user")).departmentId;
    axios
        .get(`/api/departments/${deptId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          const jobsData = [];
          res.data.users.forEach((user) => {
            user.jobs.forEach((job) => {
              jobsData.push({
                ...job,
                startDate: moment(job.startDate).format("YYYY-MM-DD"),
                endDate: moment(job.endDate).format("YYYY-MM-DD"),
                user: user, // Add user data to job
              });
            });
          });
          setJobs(jobsData);
        })
        .catch(console.error);
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    fetchJobs(department.id);
  };

  const theme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "8px",
        },
      },
    },
  });

  return (
      <div className="container-fluid pt-2">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Job List</h1>
          <Button variant="success" onClick={() => setShowAddModel(true)}>
            <i className="fas fa-plus"></i> Add Job
          </Button>
        </div>

        {/* Department Dropdown */}
        <div className="mb-4">
          <Dropdown>
            <Dropdown.Toggle variant="info" id="department-dropdown">
              {selectedDepartment ? `Department: ${selectedDepartment.name}` : "Select a Department"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {departments.map((department) => (
                  <Dropdown.Item
                      key={department.id}
                      onClick={() => handleDepartmentSelect(department)}
                  >
                    {department.name}
                  </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Job Table */}
        <Card className="main-card">
          <Card.Header>
            <strong>{selectedDepartment?.name || "Jobs"}</strong>
          </Card.Header>
          <Card.Body>
            <ThemeProvider theme={theme}>
              <MaterialTable
                  columns={[
                    { title: "JOB ID", field: "id" },
                    { title: "Job Title", field: "jobTitle" },
                    { title: "Employee", field: "user.fullName" },
                    { title: "Start Date", field: "startDate" },
                    { title: "End Date", field: "endDate" },
                    {
                      title: "State",
                      field: "endDate",
                      render: (job) =>
                          new Date(job.startDate).setHours(0) > new Date() ? (
                              <Badge bg="warning">Future Job</Badge>
                          ) : new Date(job.endDate).setHours(24) >= new Date() ? (
                              <Badge bg="success">Current Job</Badge>
                          ) : (
                              <Badge bg="danger">Old Job</Badge>
                          ),
                    },
                  ]}
                  data={jobs}
                  options={{
                    rowStyle: (_, index) =>
                        index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : null,
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30],
                  }}
                  title={selectedDepartment?.name || "Job List"}
              />
            </ThemeProvider>
          </Card.Body>
        </Card>
      </div>
  );
};

export default JobList;
