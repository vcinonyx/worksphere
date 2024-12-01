import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";



const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                padding: "6px 6px 6px 6px",
            },
        },
    },
});

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const response = await axios.get(`/api/applications/user/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const formattedApplications = response.data.map((app) => ({
                    ...app,
                    startDate: moment(app.startDate).format("YYYY-MM-DD"),
                    endDate: moment(app.endDate).format("YYYY-MM-DD"),
                }));

                setApplications(formattedApplications);
            } catch (error) {
                setHasError(true);
                setErrorMsg(error.message);
            }
        };

        fetchApplications();
    }, []);

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
                                ]}
                                data={applications}
                                options={{
                                    rowStyle: (rowData, index) => ({
                                        backgroundColor: index % 2 ? "#f2f2f2" : "white",
                                    }),
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
