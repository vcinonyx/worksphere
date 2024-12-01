import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import axios from "axios";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const EmployeeList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewRedirect, setViewRedirect] = useState(false);
    const [viewSalaryRedirect, setViewSalaryRedirect] = useState(false);

    useEffect(() => {
        const departmentId = JSON.parse(localStorage.getItem("user")).departmentId;

        axios
            .get(`/api/users/department/${departmentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleView = (user) => () => {
        setSelectedUser(user);
        setViewRedirect(true);
    };

    const handleSalaryView = (user) => () => {
        setSelectedUser({ user: { id: user.id } });
        setViewSalaryRedirect(true);
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

    if (viewRedirect) {
        return <Redirect to={{ pathname: "/employee-view", state: { selectedUser } }} />;
    }

    if (viewSalaryRedirect) {
        return <Redirect to={{ pathname: "/salary-view", state: { selectedUser } }} />;
    }

    return (
        <div className="container-fluid pt-4">
            <div className="col-sm-12">
                <Card>
                    <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
                        <div className="panel-title">
                            <strong>Employee List</strong>
                        </div>
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
                                            rowData.jobs.map((job) => {
                                                if (
                                                    new Date(job.startDate).setHours(0) <= Date.now() &&
                                                    new Date(job.endDate).setHours(24) >= Date.now()
                                                ) {
                                                    return job.jobTitle;
                                                }
                                                return null;
                                            }),
                                    },
                                    { title: "Mobile", field: "user_personal_info.mobile" },
                                    {
                                        title: "Status",
                                        field: "active",
                                        render: (rowData) =>
                                            rowData.active ? (
                                                <Badge pill variant="success">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge pill variant="danger">
                                                    Inactive
                                                </Badge>
                                            ),
                                    },
                                    {
                                        title: "View",
                                        render: (rowData) => (
                                            <Form>
                                                <Button size="sm" variant="info" onClick={handleView(rowData)}>
                                                    <i className="far fa-address-card"></i>
                                                </Button>
                                                <Button
                                                    className="ml-2"
                                                    size="sm"
                                                    variant="info"
                                                    onClick={handleSalaryView(rowData)}
                                                >
                                                    <i className="fas fa-euro-sign"></i>
                                                </Button>
                                            </Form>
                                        ),
                                    },
                                ]}
                                data={users}
                                options={{
                                    rowStyle: (_, index) => ({
                                        backgroundColor: index % 2 ? "#f2f2f2" : "white",
                                    }),
                                    pageSize: 10,
                                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
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
