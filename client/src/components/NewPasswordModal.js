import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const PasswordModal = ({ onHide, ...props }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setPasswordMismatch(true);
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;

        try {
            await axios.put(
                `api/users/changePassword/${userId}`,
                { oldPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            setPasswordChanged(true);
            setPasswordMismatch(false);
            setHasError(false);
            setErrMsg("");
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            setHasError(true);
            setErrMsg(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {passwordChanged && (
                    <Alert variant="success" className="m-1">
                        Password changed successfully.
                    </Alert>
                )}
                {passwordMismatch && (
                    <Alert variant="warning" className="m-1">
                        Passwords don't match.
                    </Alert>
                )}
                {hasError && (
                    <Alert variant="danger" className="m-1">
                        {errMsg}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formOldPassword">
                        <Form.Label className="required">Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter old password"
                            className="col-6"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formNewPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            className="col-6"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formConfirmNewPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Repeat new password"
                            className="col-6"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Text className="mb-3 required">Required Fields</Form.Text>
                    <Button variant="success" type="submit">
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

export default PasswordModal;
