import React, { useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const deptId = JSON.parse(localStorage.getItem("user")).departmentId;
                const response = await axios.get(`/api/departments/announcements/department/${deptId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setAnnouncements(response.data);
            } catch (error) {
                setHasError(true);
                setErrorMsg("Error fetching announcements");
                console.error(error);
            }
        };

        fetchAnnouncements();
    }, []);

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
            <div className="row">
                <div className="col-sm-12">
                    <Card className="main-card">
                        <Card.Header>
                            <div className="panel-title">
                                <strong>Announcement List</strong>
                            </div>
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
                                    ]}
                                    data={announcements}
                                    options={{
                                        rowStyle: (rowData, index) => {
                                            if (index % 2) {
                                                return { backgroundColor: "#f2f2f2" };
                                            }
                                        },
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
