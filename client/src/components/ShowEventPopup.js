import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ShowEventPopup = (props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [done, setDone] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [id, setId] = useState(null);

    useEffect(() => {
        if (props.data) {
            setId(props.data.id);
            setTitle(props.data.title);
            setDescription(props.data.description);
            setStartDate(new Date(props.data.start));
            setEndDate(new Date(props.data.end));
        }
    }, [props.data]);

    const handleChange = (event) => {
        const { value, name } = event.target;
        if (name === 'title') {
            setTitle(value);
        } else if (name === 'description') {
            setDescription(value);
        }
    };

    const deleteEvent = (e) => {
        e.preventDefault();
        axios({
            method: 'delete',
            url: `/api/events/${id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                if (res.status !== 200) {
                    alert(res.data);
                } else {
                    setDone(true);
                }
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (startDate > endDate) {
            setShowAlert(true);
        } else {
            let userId = JSON.parse(localStorage.getItem("user")).id;
            const event = {
                eventTitle: title,
                eventDescription: description,
                eventStartDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
                eventEndDate: moment(endDate).format("YYYY-MM-DD HH:mm:ss")
            };

            axios({
                method: "put",
                url: `/api/events/${id}`,
                data: event,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => {
                    if (res.status !== 200) {
                        alert(res.data);
                    } else {
                        setDone(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Event Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {done ? <Redirect to="/" /> : null}
                {showAlert ? (
                    <Alert variant="warning" className="m-1">
                        <Alert.Heading>Wrong End Date</Alert.Heading>
                        <p>End Date should be after Start Date</p>
                    </Alert>
                ) : null}
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Title <span style={{ color: "red" }}>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a Title"
                            className="col-6"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a Description"
                            className="col-6"
                            name="description"
                            value={description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formStartDate mt-1">
                        <Form.Label className="required">Start Date</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={(newStartDate) => setStartDate(newStartDate)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            name="startDate"
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
                        <Form.Label>End Date</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={(newEndDate) => setEndDate(newEndDate)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            name="endDate"
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
                <Form onSubmit={deleteEvent}>
                    <Button variant="danger" type="submit" className="mt-2">
                        Delete
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowEventPopup;
