import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditDepartmentModal = ({ show, onHide, data }) => {
    const [departmentName, setDepartmentName] = useState("");
    const [id, setId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setDepartmentName(data.departmentName);
            setId(data.id);
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedDepartment = { departmentName };

        axios
            .put(`/api/departments/${id}`, updatedDepartment, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => {
                navigate("/departments");
            })
            .catch((err) => {
                setShowAlert(true);
                setErrorMsg(err.response?.data?.message || "An error occurred.");
            });
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Department
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert variant="warning" className="m-1">
                        {errorMsg}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDepartmentName">
                        <Form.Label className="mb-2">Department Name</Form.Label>
                        <Form.Control
                            type="text"
                            className="col-8"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
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

export default EditDepartmentModal;
