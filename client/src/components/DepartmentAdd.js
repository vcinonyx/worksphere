import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DepartmentAdd = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setDepartmentName(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);
    setErrMsg("");
    setCompleted(false);

    try {
      await axios.post(
          "/api/departments",
          { departmentName },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      setCompleted(true);
    } catch (err) {
      setHasError(true);
      setErrMsg(err.response?.data?.message || "An error occurred");
      window.scrollTo(0, 0);
    }
  };

  if (completed) {
    navigate("/departments");
  }

  return (
      <Card className="mb-3 secondary-card">
        <Card.Header>
          <strong>Add Department</strong>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <Form onSubmit={onSubmit}>
              <Form.Group controlId="formDepartmentName">
                <Form.Label className="text-muted mb-2">Department Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Department Name"
                    name="departmentName"
                    style={{ width: "50%" }}
                    value={departmentName}
                    onChange={handleChange}
                    required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                Add
              </Button>
            </Form>
          </Card.Text>
        </Card.Body>
        {hasError && (
            <Alert variant="danger" className="m-3">
              {errMsg}
            </Alert>
        )}
      </Card>
  );
};

export default DepartmentAdd;
