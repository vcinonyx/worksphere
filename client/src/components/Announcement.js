import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [completed, setCompleted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get("/api/departments", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setDepartments(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get("/api/departments/announcements", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setAnnouncements(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDepartments();
        fetchAnnouncements();
    }, []);

    const handleDelete = (announcement) => async (event) => {
        event.preventDefault();
        try {
            await axios.delete(`/api/departments/announcements/${announcement.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCompleted(true);
        } catch (err) {
            setHasError(true);
            setErrorMsg(err.response.data.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const departmentId = selectedDepartment !== "all" ? selectedDepartment : null;

        const data = {
            announcementTitle: title,
            announcementDescription: description,
            createdByUserId: JSON.parse(localStorage.getItem("user")).id,
            departmentId,
        };

        try {
            await axios.post("/api/departments/announcements", data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCompleted(true);
        } catch (err) {
            console.error(err);
        }
    };

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: "6px 6px 6px 6px",
                },
            },
        },
    });

    return (
        <div className="container-fluid pt-2">
            {completed && <Redirect to="/announcement" />}
            <div className="row">
                <div className="col-sm-12">
                    <Card className="main-card">
                        <Card.Header>
                            <strong>Add Announcement</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Department</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                    >
                                        <option value="">Choose one...</option>
                                        <option value="all">All Departments</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button type="submit" size="sm" className="mt-1">
                                    Publish
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <Card className="main-card">
                        <Card.Header>
                            <strong>Announcement List</strong>
                        </Card.Header>
                        <Card.Body>
                            <ThemeProvider theme={theme}>
                                <MaterialTable
                                    columns={[
                                        { title: "ID", field: "id" },
                                        { title: "Title", field: "announcementTitle" },
                                        { title: "Description", field: "announcementDescription" },
                                        { title: "Created By", field: "user.fullName" },
                                        { title: "Department", field: "department.departmentName" },
                                        {
                                            title: "Action",
                                            render: (rowData) => (
                                                <Button
                                                    onClick={handleDelete(rowData)}
                                                    size="sm"
                                                    variant="danger"
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </Button>
                                            ),
                                        },
                                    ]}
                                    data={announcements}
                                    options={{
                                        rowStyle: (_, index) =>
                                            index % 2 ? { backgroundColor: "#f2f2f2" } : null,
                                        pageSize: 8,
                                        pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                                    }}
                                    title="Announcements"
                                />
                            </ThemeProvider>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            {hasError && (
                <Alert variant="danger" className="m-3">
                    {errorMsg}
                </Alert>
            )}
        </div>
    );
};

export default Announcement;
