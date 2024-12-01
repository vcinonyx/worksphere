import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: "6px 6px 6px 6px",
                },
            },
        },
    });

    useEffect(() => {
        const deptId = JSON.parse(localStorage.getItem("user")).departmentId;
        axios
            .get(`/api/departments/announcements/department/${deptId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                setAnnouncements(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleDelete = (announcementId) => {
        axios
            .delete(`/api/departments/announcements/${announcementId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setCompleted(true))
            .catch((err) => {
                setHasError(true);
                setErrorMsg(err.response?.data?.message || "Error deleting announcement.");
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const deptId = JSON.parse(localStorage.getItem("user")).departmentId;

        const data = {
            announcementTitle: title,
            announcementDescription: description,
            createdByUserId: JSON.parse(localStorage.getItem("user")).id,
            departmentId: deptId,
        };

        axios
            .post("/api/departments/announcements", data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setCompleted(true))
            .catch((err) => console.error(err));
    };

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
                            <Card.Text>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            name="title"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            name="description"
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" size="sm" className="mt-1">
                                        Publish
                                    </Button>
                                </Form>
                            </Card.Text>
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
                                            render: (rowData) =>
                                                rowData.user.id === JSON.parse(localStorage.getItem("user")).id && (
                                                    <Button
                                                        onClick={() => handleDelete(rowData.id)}
                                                        size="sm"
                                                        variant="danger"
                                                    >
                                                        <i className="fas fa-trash"></i>Delete
                                                    </Button>
                                                ),
                                        },
                                    ]}
                                    data={announcements}
                                    options={{
                                        rowStyle: (rowData, index) => ({
                                            backgroundColor: index % 2 ? "#f2f2f2" : "white",
                                        }),
                                        pageSize: 7,
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
