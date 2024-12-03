import React, { useState, useEffect } from "react";
import { Accordion, Card, Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";

const EmployeeAdd = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "Single",
    fathername: "",
    idNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    iBan: "",
    address: "",
    country: "",
    city: "",
    mobile: null,
    phone: null,
    email: "",
    username: "",
    password: "",
    role: "",
    department: "",
    departmentId: null,
    startDate: "",
    endDate: "",
    departments: [],
    jobTitle: null,
    joiningDate: "",
    file: null,
  });

  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios
        .get("/api/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setFormData((prevState) => ({
            ...prevState,
            departments: res.data,
          }));
        })
        .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };

  const pushDepartments = () => {
    return formData.departments.map((dept, index) => (
        <option key={index} value={dept.id}>
          {dept.departmentName}
        </option>
    ));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setHasError(false);
    setCompleted(true);
  };

  return (
      <Form onSubmit={onSubmit}>
        <div className="container-fluid">
          {hasError && <Alert variant="danger">{errMsg}</Alert>}
          {completed && <Alert variant="success">Employee has been added!</Alert>}

          <Accordion defaultActiveKey="0">
            {/* Personal Details */}
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Personal Details
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                    />
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <DatePicker
                        selected={formData.dateOfBirth}
                        onChange={(date) => handleDateChange("dateOfBirth", date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date of birth"
                    />
                  </Form.Group>
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                      <option value="">Choose...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formMaritalStatus">
                    <Form.Label>Marital Status</Form.Label>
                    <Form.Control
                        as="select"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formFatherName">
                    <Form.Label>Father's Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="fathername"
                        value={formData.fathername}
                        onChange={handleChange}
                        placeholder="Enter father's name"
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>

            {/* Other Details (Contact, Bank, Job) */}
            {/* Repeat similar structure for other details */}
          </Accordion>

          <div className="mt-4">
            <Button type="submit" variant="primary" block>
              Submit
            </Button>
          </div>
        </div>
      </Form>
  );
};

export default EmployeeAdd;
