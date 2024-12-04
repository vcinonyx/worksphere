import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const JobEditModal = ({ data, onHide, ...props }) => {
    const [jobTitle, setJobTitle] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (data) {
            setJobTitle(data.jobTitle);
            setStartDate(moment(new Date(data.startDate)).toDate());
            setEndDate(moment(new Date(data.endDate)).toDate());
            setDepartmentId(data.user.departmentId);
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const job = {
            jobTitle,
            startDate,
            endDate,
        };

        axios
            .put(`/api/jobs/${data.id}`, job, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setDone(true))
            .catch((err) => {
                setShowAlert(true);
                setErrorMsg(err.response?.data?.message || "An error occurred.");
            });
    };

    if (done) {
        return <Redirect to={{ pathname: "/job-list", state: { selectedDepartment: departmentId } }} />;
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Edit Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
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
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
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
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobEditModal;
