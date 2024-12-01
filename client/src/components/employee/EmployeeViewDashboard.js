import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

const EmployeeViewEmployee = () => {
    const [user, setUser] = useState({});
    const [department, setDepartment] = useState({ departmentName: null });
    const [job, setJob] = useState({ jobTitle: null });
    const [userPersonalInfo, setUserPersonalInfo] = useState({
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
    });
    const [userFinancialInfo, setUserFinancialInfo] = useState({
        bankName: null,
        accountName: null,
        accountNumber: null,
        iban: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const res = await axios.get(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const fetchedUser = res.data;
                setUser(fetchedUser);

                if (fetchedUser.jobs) {
                    const currentJob = fetchedUser.jobs.find(
                        (job) =>
                            new Date(job.startDate) <= Date.now() &&
                            (!job.endDate || new Date(job.endDate) >= Date.now())
                    );
                    if (currentJob) setJob(currentJob);
                }

                if (fetchedUser.department) setDepartment(fetchedUser.department);

                if (fetchedUser.user_personal_info) {
                    const personalInfo = { ...fetchedUser.user_personal_info };
                    if (personalInfo.dateOfBirth) {
                        personalInfo.dateOfBirth = moment(personalInfo.dateOfBirth).format(
                            "D MMM YYYY"
                        );
                    }
                    setUserPersonalInfo(personalInfo);
                }

                if (fetchedUser.user_financial_info) {
                    setUserFinancialInfo(fetchedUser.user_financial_info);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
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
                    <Col lg={12}>
                        <Row className="pt-4">
                            <Col lg={3}>
                                <img
                                    className="img-circle elevation-1 bp-2"
                                    src={`${process.env.PUBLIC_URL}/user-128.png`}
                                    alt="User"
                                />
                            </Col>
                            <Col className="pt-4" lg={9}>
                                <div className="emp-view-list">
                                    <ul>
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
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Card className="secondary-card emp-view">
                                    <Card.Header>Personal Details</Card.Header>
                                    <Card.Body>
                                        <Card.Text id="emp-view-personal-dashboard">
                                            <Form.Group as={Row}>
                                                <Form.Label className="label">Date of Birth:</Form.Label>
                                                <span>{userPersonalInfo.dateOfBirth}</span>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label className="label">Gender:</Form.Label>
                                                <span>{userPersonalInfo.gender}</span>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label className="label">
                                                    Marital Status:
                                                </Form.Label>
                                                <span>{userPersonalInfo.maritalStatus}</span>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label className="label">
                                                    Father's Name:
                                                </Form.Label>
                                                <span>{userPersonalInfo.fatherName}</span>
                                            </Form.Group>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={6}>
                                <Card className="secondary-card emp-view">
                                    <Card.Header>Contact Details</Card.Header>
                                    <Card.Body>
                                        <Card.Text id="emp-view-contact-dashboard">
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
                                                    {userPersonalInfo.phone &&
                                                        `(${userPersonalInfo.phone})`}
                        </span>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label className="label">
                                                    Email Address:
                                                </Form.Label>
                                                <span>{userPersonalInfo.emailAddress}</span>
                                            </Form.Group>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Card className="secondary-card">
                                    <Card.Header>Bank Information</Card.Header>
                                    <Card.Body>
                                        <Card.Text id="emp-view-bank-dashboard">
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
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default EmployeeViewEmployee;
