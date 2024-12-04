import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const JobAddModal = (props) => {
    const [id, setId] = useState(null);
    const [jobTitle, setJobTitle] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        axios
            .get("api/departments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                setDepartments(res.data);
            });
    };

    const fetchUsers = () => {
        const department = departments.find(
            (dept) => dept.id.toString() === selectedDepartment
        );
        if (department) {
            setUsers(department.users);
        }
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setUsers([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const job = {
            jobTitle,
            startDate,
            endDate,
            userId: selectedUser,
        };

        axios
            .post(`/api/jobs`, job, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setDone(true))
            .catch((err) => {
                setShowAlert(true);
                setErrorMsg(err.response?.data?.message || "An error occurred");
            });
    };

    useEffect(() => {
        if (selectedDepartment) {
            fetchUsers();
        }
    }, [selectedDepartment]);

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Department Selection */}
                    <Form.Group>
                        <Form.Label className="mb-2 required">Select Department</Form.Label>
                        <Form.Control
                            as="select"
                            className="form-control"
                            value={selectedDepartment || ""}
                            onChange={handleDepartmentChange}
                        >
                            <option value="">Choose one...</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept.id}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* User Selection */}
                    {selectedDepartment && (
                        <Form.Group>
                            <Form.Label>Select User</Form.Label>
                            <Form.Control
                                as="select"
                                className="form-control"
                                value={selectedUser || ""}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">Choose one...</option>
                                {users.map((user, index) => (
                                    <option key={index} value={user.id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}

                    {/* Job Details */}
                    {done && <Redirect to="/job-list" />}
                    {showAlert && (
                        <Alert variant="warning" className="m-1">
                            {errorMsg}
                        </Alert>
                    )}
                    <Form.Group controlId="formJobTitle">
                        <Form.Label className="mb-2 required">Job Title</Form.Label>
                        <Form.Control
                            type="text"
                            className="col-8"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formStartDate">
                        <Form.Label className="mb-2 required">Job Start Date</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control ml-1"
                            placeholderText="Select Start Date"
                            autoComplete="off"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEndDate">
                        <Form.Label className="mb-2 required">Job End Date</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={startDate || new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control ml-1"
                            placeholderText="Select End Date"
                            autoComplete="off"
                            required
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="mt-2">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobAddModal;
