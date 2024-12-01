import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import EditDepartmentModal from "./EditDepartmentModal";
import AlertModal from "./AlertModal";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showEditModel, setShowEditModel] = useState(false);
  const [showAlertModel, setShowAlertModel] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
        .get("/api/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setDepartments(res.data))
        .catch(console.error);
  }, []);

  const handleAddDepartmentToggle = () => {
    setIsAddDepartmentOpen((prev) => !prev);
    setNewDepartmentName("");
    setHasError(false);
    setErrorMsg("");
  };

  const handleAddDepartmentSubmit = (event) => {
    event.preventDefault();

    if (!newDepartmentName.trim()) {
      setHasError(true);
      setErrorMsg("Department name cannot be empty.");
      return;
    }

    axios
        .post(
            "/api/departments",
            { departmentName: newDepartmentName },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        )
        .then((res) => {
          setDepartments((prev) => [...prev, res.data]);
          setIsAddDepartmentOpen(false);
          setNewDepartmentName("");
          setHasError(false);
        })
        .catch((err) => {
          setHasError(true);
          setErrorMsg(err.response?.data?.message || "Failed to add department.");
        });
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowEditModel(true);
  };

  const handleDelete = (department) => {
    if (department.users.length > 0) {
      setShowAlertModel(true);
    } else {
      axios
          .delete(`/api/departments/${department.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then(() => {
            setDepartments((prev) =>
                prev.filter((dept) => dept.id !== department.id)
            );
            setCompleted(true);
            navigate("/departments");
          })
          .catch((err) => {
            setHasError(true);
            setErrorMsg(
                err.response?.data?.message || "Failed to delete department."
            );
          });
    }
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
      <div className="container-fluid department-list">
        <section className="department-add">
          <Button
              variant="primary"
              onClick={handleAddDepartmentToggle}
              className="mb-3"
          >
            {isAddDepartmentOpen ? "Cancel Add Department" : "Add Department"}
          </Button>
          {isAddDepartmentOpen && (
              <Form
                  onSubmit={handleAddDepartmentSubmit}
                  className="add-department-form"
              >
                <Form.Group controlId="newDepartmentName">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Enter department name"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Submit
                </Button>
              </Form>
          )}
        </section>

        {hasError && (
            <Alert variant="danger" className="mt-3">
              {errorMsg}
            </Alert>
        )}

        <section className="department-table">
          <Card className="main-card">
            <Card.Header>
              <strong>Department List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                    columns={[
                      { title: "ID", field: "id" },
                      { title: "Department Name", field: "departmentName" },
                      {
                        title: "Jobs",
                        render: (dept) => (
                            <NavLink
                                to={{
                                  pathname: "/job-list",
                                  state: { selectedDepartment: dept.id },
                                }}
                            >
                              View Jobs
                            </NavLink>
                        ),
                      },
                      {
                        title: "Actions",
                        render: (rowData) => (
                            <div className="action-buttons">
                              <Button
                                  size="sm"
                                  variant="info"
                                  onClick={() => handleEdit(rowData)}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </Button>
                              <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDelete(rowData)}
                              >
                                <i className="fas fa-trash"></i> Delete
                              </Button>
                            </div>
                        ),
                      },
                    ]}
                    data={departments}
                    options={{
                      rowStyle: (_, index) =>
                          index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : null,
                      pageSize: 8,
                      pageSizeOptions: [5, 10, 20, 50],
                    }}
                    title="Departments"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </section>

        {showEditModel && (
            <EditDepartmentModal
                show
                onHide={() => setShowEditModel(false)}
                data={selectedDepartment}
            />
        )}
        {showAlertModel && (
            <AlertModal
                show
                onHide={() => setShowAlertModel(false)}
                message="Cannot delete department with active users."
            />
        )}
      </div>
  );
};

export default DepartmentList;
