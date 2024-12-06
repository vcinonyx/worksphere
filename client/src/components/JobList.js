import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import axios from "axios";
import moment from "moment";
import JobAddModal from "./JobAddModal";
import JobEditModal from "./JobEditModal";
import JobDeleteModal from "./JobDeleteModal";

const JobList = ({ location }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch departments on mount
    useEffect(() => {
        if (location?.state?.selectedDepartment) {
            setSelectedDepartment(location.state.selectedDepartment);
        }

        axios
            .get("/api/departments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => setDepartments(res.data))
            .catch(console.error);
    }, [location]);

    // Fetch jobs when selectedDepartment changes
    useEffect(() => {
        if (selectedDepartment) {
            if (selectedDepartment === "all") {
                fetchAllJobs();
            } else {
                fetchJobsByDepartment(selectedDepartment);
            }
        }
    }, [selectedDepartment]);

    const fetchJobsByDepartment = (departmentId) => {
        axios
            .get(`/api/departments/${departmentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                const department = res.data;
                const departmentJobs = department.users.flatMap((user) =>
                    user.jobs.map((job) => ({
                        ...job,
                        startDate: moment(job.startDate).format("YYYY-MM-DD"),
                        endDate: moment(job.endDate).format("YYYY-MM-DD"),
                    }))
                );
                setJobs(departmentJobs);
            })
            .catch(console.error);
    };

    const fetchAllJobs = () => {
        axios
            .get(`/api/departments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                const allJobs = res.data.flatMap((department) =>
                    department.users.flatMap((user) =>
                        user.jobs.map((job) => ({
                            ...job,
                            startDate: moment(job.startDate).format("YYYY-MM-DD"),
                            endDate: moment(job.endDate).format("YYYY-MM-DD"),
                        }))
                    )
                );
                setJobs(allJobs);
            })
            .catch(console.error);
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const renderDepartments = () => [
        <option key="all" value="all">
            All departments
        </option>,
        ...departments.map((dept, index) => (
            <option key={index} value={dept.id}>
                {dept.departmentName}
            </option>
        )),
    ];

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: { padding: "6px 6px 6px 6px" },
            },
        },
    });

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                <div className="col-sm-12">
                    <Card className="secondary-card">
                        <Card.Header>
                            <div className="required">Select Department</div>
                        </Card.Header>
                        <Card.Body>
                            <select
                                className="select-css"
                                value={selectedDepartment || ""}
                                onChange={handleDepartmentChange}
                            >
                                <option value="">Choose one...</option>
                                {renderDepartments()}
                            </select>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <Button
                        variant="primary"
                        size="lg"
                        className="add-job-button mb-3"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="fas fa-plus"></i> Add Job
                    </Button>
                    <Card className="main-card">
                        <Card.Header>
                            <div className="panel-title">
                                <strong>Job List</strong>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ThemeProvider theme={theme}>
                                <MaterialTable
                                    columns={[
                                        { title: "Id", field: "id" },
                                        { title: "Title", field: "jobTitle" },
                                        { title: "Employee", field: "user.fullName" },
                                        { title: "Start Date", field: "startDate" },
                                        { title: "End Date", field: "endDate" },
                                        {
                                            title: "State",
                                            field: "endDate",
                                            render: (job) => (
                                                new Date(job.startDate).setHours(0) > new Date() ? (
                                                    <Badge variant="warning">Future Job</Badge>
                                                ) : new Date(job.endDate).setHours(24) >= new Date() ? (
                                                    <Badge variant="success">Current Job</Badge>
                                                ) : (
                                                    <Badge variant="danger">Old Job</Badge>
                                                )
                                            ),
                                        },
                                        {
                                            title: "Action",
                                            render: (job) => (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="info"
                                                        className="mr-2"
                                                        onClick={() => {
                                                            setSelectedJob(job);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => {
                                                            setSelectedJob(job);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i> Delete
                                                    </Button>
                                                </>
                                            ),
                                        },
                                    ]}
                                    data={jobs}
                                    options={{
                                        rowStyle: (_, index) =>
                                            index % 2 ? { backgroundColor: "#f2f2f2" } : null,
                                        pageSize: 8,
                                        pageSizeOptions: [5, 10, 20, 50],
                                    }}
                                    title="Jobs"
                                />
                            </ThemeProvider>
                        </Card.Body>
                    </Card>

                    {/* Modals */}
                    {showAddModal && (
                        <JobAddModal
                            show
                            onHide={() => setShowAddModal(false)}
                        />
                    )}
                    {showEditModal && (
                        <JobEditModal
                            show
                            onHide={() => setShowEditModal(false)}
                            data={selectedJob}
                        />
                    )}
                    {showDeleteModal && (
                        <JobDeleteModal
                            show
                            onHide={() => setShowDeleteModal(false)}
                            data={selectedJob}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobList;
