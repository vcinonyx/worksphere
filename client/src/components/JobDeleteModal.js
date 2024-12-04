import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";

const JobDeleteModal = ({ data, onHide, ...props }) => {
    const [redirect, setRedirect] = useState(false);

    const handleDelete = (event) => {
        event.preventDefault();

        axios
            .delete(`api/jobs/${data.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => setRedirect(true))
            .catch((err) => {
                console.error(err);
            });
    };

    if (redirect) {
        return <Redirect to="/job-list" />;
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                By deleting a Job, you will also delete all of its payment records. Are
                you sure?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobDeleteModal;
