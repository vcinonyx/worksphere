import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

const Application = () => {
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState("");
    const [hasError, setHasError] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasError(false);
        setErrMsg("");
        setCompleted(false);

        const userId = JSON.parse(localStorage.getItem("user")).id;

        const application = {
            type,
            startDate,
            endDate,
            status: "Pending",
            reason,
            userId,
        };

        try {
            await axios.post("/api/applications", application, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCompleted(true);
        } catch (err) {
            setHasError(true);
            setErrMsg(err.response?.data?.message || "An error occurred.");
            window.scrollTo(0, 0);
        }
    };

    if (completed) {
        return <Redirect to="/application-list" />;
    }

    return (
        <div className="container-fluid pt-4">
            {hasError && (
                <Alert variant="danger" className="m-3">
                    {errMsg}
                </Alert>
            )}
            <Card className="mb-3 main-card">
                <Card.Header>
                    <b>Make Application</b>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formDepartmentName">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                style={{ width: "50%" }}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Choose one</option>
                                <option value="illness">Illness</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Row>
                                <DatePicker
                                    selected={startDate}
                                    className="form-control ml-1"
                                    onChange={(date) => setStartDate(date)}
                                    required
                                />
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Row>
                                <DatePicker
                                    selected={endDate}
                                    className="form-control ml-1"
                                    onChange={(date) => setEndDate(date)}
                                    required
                                />
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Reason <span className="text-muted">(Comments)</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Add
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Application;
