import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@material-ui/core";

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        axios
            .get("/api/applications", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                const formattedApplications = res.data.map((app) => ({
                    ...app,
                    startDate: moment(app.startDate).format("YYYY-MM-DD"),
                    endDate: moment(app.endDate).format("YYYY-MM-DD"),
                }));
                setApplications(formattedApplications);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleApprove = (app) => {
        axios
            .put(`/api/applications/${app.id}`, { status: "Approved" }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setCompleted(true))
            .catch((err) => {
                setHasError(true);
                setErrorMsg(err.response?.data?.message || "Error updating application.");
            });
    };

    const handleReject = (app) => {
        axios
            .put(`/api/applications/${app.id}`, { status: "Rejected" }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setCompleted(true))
            .catch((err) => {
                setHasError(true);
                setErrorMsg(err.response?.data?.message || "Error updating application.");
            });
    };

    const theme = createTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: "6px",
                },
            },
        },
    });

    if (completed) {
        return <Redirect to="/application-list" />;
    }

    return (
        <div className="container-fluid pt-5">
            <div className="col-sm-12">
                <Card>
                    <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
                        <div className="panel-title">
                            <strong>Application List</strong>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ThemeProvider theme={theme}>
                            <MaterialTable
                                columns={[
                                    { title: "APP ID", field: "id" },
                                    { title: "Full Name", field: "user.fullName" },
                                    { title: "Start Date", field: "startDate" },
                                    { title: "End Date", field: "endDate" },
                                    { title: "Leave Type", field: "type" },
                                    { title: "Comments", field: "reason" },
                                    {
                                        title: "Status",
                                        field: "status",
                                        render: (rowData) => (
                                            <Button
                                                size="sm"
                                                variant={
                                                    rowData.status === "Approved"
                                                        ? "success"
                                                        : rowData.status === "Pending"
                                                            ? "warning"
                                                            : "danger"
                                                }
                                            >
                                                {rowData.status}
                                            </Button>
                                        ),
                                    },
                                    {
                                        title: "Action",
                                        render: (rowData) =>
                                            rowData.user.id !== JSON.parse(localStorage.getItem("user")).id &&
                                            rowData.status === "Pending" ? (
                                                <>
                                                    <Button
                                                        onClick={() => handleApprove(rowData)}
                                                        variant="success"
                                                        size="sm"
                                                        className="mr-2"
                                                    >
                                                        <i className="fas fa-edit"></i> Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleReject(rowData)}
                                                        variant="danger"
                                                        size="sm"
                                                        className="ml-2"
                                                    >
                                                        <i className="fas fa-trash"></i> Reject
                                                    </Button>
                                                </>
                                            ) : null,
                                    },
                                ]}
                                data={applications}
                                options={{
                                    rowStyle: (_, index) =>
                                        index % 2 ? { backgroundColor: "#f2f2f2" } : null,
                                    pageSize: 10,
                                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                                }}
                                title="Applications"
                            />
                        </ThemeProvider>
                    </Card.Body>
                </Card>
            </div>
            {hasError && (
                <Alert variant="danger" className="m-3">
                    {errorMsg}
                </Alert>
            )}
        </div>
    );
};

export default ApplicationList;
