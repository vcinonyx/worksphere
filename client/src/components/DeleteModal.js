import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteModal = ({ data, onHide, ...props }) => {
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const onDelete = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(`api/users/${data.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRedirect(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (redirect) {
        navigate("/employee-list");
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
                Are you sure you want to delete Employee: {data.fullName}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
