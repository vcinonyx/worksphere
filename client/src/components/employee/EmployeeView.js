import React, { Component } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

export default class EmployeeProfile extends Component {
    state = {
        user: {},
        department: { departmentName: null },
        job: { jobTitle: null },
        userPersonalInfo: {
            dateOfBirth: null,
            gender: null,
            maritalStatus: null,
            fatherName: null,
            country: null,
            city: null,
            address: null,
            mobile: null,
            phone: null,
            emailAddress: null,
        },
        userFinancialInfo: {
            bankName: null,
            accountName: null,
            accountNumber: null,
            iban: null,
        },
        editRedirect: false,
    };

    componentDidMount() {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        axios
            .get(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                const user = res.data;

                this.setState({ user }, () => {
                    if (user.jobs) {
                        const currentJob = user.jobs.find(
                            (job) =>
                                new Date(job.startDate) <= Date.now() &&
                                (!job.endDate || new Date(job.endDate) >= Date.now())
                        );
                        if (currentJob) this.setState({ job: currentJob });
                    }

                    if (user.department) this.setState({ department: user.department });

                    if (user.user_personal_info) {
                        const personalInfo = { ...user.user_personal_info };
                        if (personalInfo.dateOfBirth) {
                            personalInfo.dateOfBirth = moment(personalInfo.dateOfBirth).format(
                                "D MMM YYYY"
                            );
                        }
                        this.setState({ userPersonalInfo: personalInfo });
                    }

                    if (user.user_financial_info) {
                        this.setState({ userFinancialInfo: user.user_financial_info });
                    }
                });
            })
            .catch((err) => console.error(err));
    }

    render() {
        const { user, department, job, userPersonalInfo, userFinancialInfo } =
            this.state;

        return (
            <div className="container-fluid pt-3">
                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Header
                                style={{ backgroundColor: "#515e73", color: "white", fontSize: "17px" }}
                            >
                                My Profile
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <strong>{user.fullName}</strong>
                                </Card.Title>
                                <Card.Text>
                                    <Row className="pt-4">
                                        <Col lg={3}>
                                            <img
                                                className="img-circle elevation-1 bp-2"
                                                src={`${process.env.PUBLIC_URL}/user-128.png`}
                                                alt="User Avatar"
                                            />
                                        </Col>
                                        <Col className="pt-4" lg={9}>
                                            <ul className="emp-view-list">
                                                <li>
                                                    <span>Employee ID: </span> {user.id}
                                                </li>
                                                <li>
                                                    <span>Department: </span> {department.departmentName}
                                                </li>
                                                <li>
                                                    <span>Job Title: </span> {job.jobTitle}
                                                </li>
                                                <li>
                                                    <span>Role: </span>
                                                    {user.role === "ROLE_ADMIN"
                                                        ? "Admin"
                                                        : user.role === "ROLE_MANAGER"
                                                            ? "Manager"
                                                            : "Employee"}
                                                </li>
                                            </ul>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header>Personal Details</Card.Header>
                                                <Card.Body>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Date of Birth:</Form.Label>
                                                        <span>{userPersonalInfo.dateOfBirth}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Gender:</Form.Label>
                                                        <span>{userPersonalInfo.gender}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Father's Name:</Form.Label>
                                                        <span>{userPersonalInfo.fatherName}</span>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header>Contact Details</Card.Header>
                                                <Card.Body>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Location:</Form.Label>
                                                        <span>
                              {userPersonalInfo.country}, {userPersonalInfo.city}
                            </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Address:</Form.Label>
                                                        <span>{userPersonalInfo.address}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Mobile:</Form.Label>
                                                        <span>
                              {userPersonalInfo.mobile}{" "}
                                                            {userPersonalInfo.phone && `(${userPersonalInfo.phone})`}
                            </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Email Address:</Form.Label>
                                                        <span>{userPersonalInfo.emailAddress}</span>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header>Bank Information</Card.Header>
                                                <Card.Body>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Bank Name:</Form.Label>
                                                        <span>{userFinancialInfo.bankName}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Account Name:</Form.Label>
                                                        <span>{userFinancialInfo.accountName}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">Account Number:</Form.Label>
                                                        <span>{userFinancialInfo.accountNumber}</span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">IBAN:</Form.Label>
                                                        <span>{userFinancialInfo.iban}</span>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
