import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const AddEventModal = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (startDate > endDate) {
            setShowAlert(true);
            return;
        }

        const userId = JSON.parse(localStorage.getItem("user")).id;
        const event = {
            eventTitle: title,
            eventDescription: description,
            eventStartDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            eventEndDate: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
            userId,
        };

        axios
            .post("/api/events", event, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setDone(true);
                } else {
                    alert(res.data);
                }
            })
            .catch((err) => console.error(err));
    };

    if (done) {
        return <Redirect to="/" />;
    }

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert variant="warning" className="m-1">
                        End Date should be after Start Date
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label className="required">Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a Title"
                            className="col-6"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a Description"
                            className="col-6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formStartDate">
                        <Form.Label className="required">Start Date</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="time"
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            className="form-control ml-1"
                            placeholderText="Select Start Date"
                            autoComplete="off"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formEndDate">
                        <Form.Label className="required">End Date</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="time"
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            className="form-control ml-3"
                            placeholderText="Select End Date"
                            autoComplete="off"
                            required
                        />
                    </Form.Group>

                    <Form.Text className="mb-3 required">Required Fields</Form.Text>
                    <Button variant="success" type="submit">
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

export default AddEventModal;
