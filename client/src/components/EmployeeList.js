import React, { useState, useEffect } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const EmployeeList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewRedirect, setViewRedirect] = useState(false);
    const [editRedirect, setEditRedirect] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        axios
            .get("/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error fetching users:", err));
    }, []);

    const handleView = (user) => {
        setSelectedUser(user);
        setViewRedirect(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditRedirect(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => setDeleteModal(false);

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: "6px",
                },
            },
        },
    });

    return (
        <div className="container-fluid pt-4">
            {viewRedirect && (
                <Redirect
                    to={{
                        pathname: "/employee-view",
                        state: { selectedUser },
                    }}
                />
            )}
            {editRedirect && (
                <Redirect
                    to={{
                        pathname: "/employee-edit",
                        state: { selectedUser },
                    }}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    show
                    onHide={closeDeleteModal}
                    data={selectedUser}
                />
            )}
            <h4>
                <Button href="/employee-add" variant="primary">
                    <i className="fas fa-plus"></i> Add Employee
                </Button>
            </h4>
            <div className="col-sm-12">
                <Card>
                    <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
                        <strong>Employee List</strong>
                    </Card.Header>
                    <Card.Body>
                        <ThemeProvider theme={theme}>
                            <MaterialTable
                                columns={[
                                    { title: "EMP ID", field: "id" },
                                    { title: "Full Name", field: "fullName" },
                                    { title: "Department", field: "department.departmentName" },
                                    {
                                        title: "Job Title",
                                        field: "jobs",
                                        render: (rowData) =>
                                            rowData.jobs
                                                ?.map(
                                                    (job) =>
                                                        new Date(job.startDate).setHours(0) <= Date.now() &&
                                                        new Date(job.endDate).setHours(24) >= Date.now()
                                                            ? job.jobTitle
                                                            : null
                                                )
                                                .filter(Boolean)
                                                .join(", ") || "N/A",
                                    },
                                    { title: "Mobile", field: "user_personal_info.mobile" },
                                    {
                                        title: "Status",
                                        field: "active",
                                        render: (rowData) => (
                                            <Badge
                                                pill
                                                variant={rowData.active ? "success" : "danger"}
                                            >
                                                {rowData.active ? "Active" : "Inactive"}
                                            </Badge>
                                        ),
                                    },
                                    {
                                        title: "Actions",
                                        render: (rowData) => (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    onClick={() => handleView(rowData)}
                                                >
                                                    <i className="far fa-address-card"></i> View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    className="ml-2"
                                                    onClick={() => handleEdit(rowData)}
                                                >
                                                    <i className="far fa-edit"></i> Edit
                                                </Button>
                                                {rowData.id !==
                                                JSON.parse(localStorage.getItem("user")).id ? (
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="ml-2"
                                                        onClick={() => handleDelete(rowData)}
                                                    >
                                                        <i className="fas fa-trash"></i> Delete
                                                    </Button>
                                                ) : null}
                                            </>
                                        ),
                                    },
                                ]}
                                data={users}
                                options={{
                                    rowStyle: (_, index) =>
                                        index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : null,
                                    pageSize: 10,
                                    pageSizeOptions: [10, 20, 30, 50],
                                }}
                                title="Employees"
                            />
                        </ThemeProvider>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeList;
