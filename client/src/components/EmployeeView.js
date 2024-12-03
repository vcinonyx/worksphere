import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const EmployeeView = (props) => {
    const [user, setUser] = useState({});
    const [department, setDepartment] = useState({ departmentName: null });
    const [job, setJob] = useState({ jobTitle: null });
    const [userPersonalInfo, setUserPersonalInfo] = useState({
        dateOfBirth: null,
        gender: null,
        maritalStatus: null,
        fatherName: null,
        country: null,
        address: null,
        mobile: null,
        emailAddress: null,
    });
    const [userFinancialInfo, setUserFinancialInfo] = useState({
        bankName: null,
        accountName: null,
        accountNumber: null,
        iban: null,
    });
    const [falseRedirect, setFalseRedirect] = useState(false);
    const [editRedirect, setEditRedirect] = useState(false);

    useEffect(() => {
        if (props.location.state) {
            const userId = props.location.state.selectedUser.id;
            axios
                .get(`api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                .then((res) => {
                    const userData = res.data;
                    setUser(userData);

                    // Set current job
                    const currentJob = userData.jobs?.find(
                        (job) =>
                            new Date(job.startDate) <= Date.now() &&
                            new Date(job.endDate) >= Date.now()
                    );
                    if (currentJob) setJob(currentJob);

                    // Set department
                    if (userData.department) setDepartment(userData.department);

                    // Set personal info
                    if (userData.user_personal_info) {
                        const personalInfo = { ...userData.user_personal_info };
                        if (personalInfo.dateOfBirth) {
                            personalInfo.dateOfBirth = moment(personalInfo.dateOfBirth).format(
                                "D MMM YYYY"
                            );
                        }
                        setUserPersonalInfo(personalInfo);
                    }

                    // Set financial info
                    if (userData.user_financial_info) {
                        setUserFinancialInfo(userData.user_financial_info);
                    }
                })
                .catch((err) => console.error(err));
        } else {
            setFalseRedirect(true);
        }
    }, [props.location.state]);

    const handleEdit = () => {
        setEditRedirect(true);
    };

    if (falseRedirect) {
        return <Redirect to="/" />;
    }

    if (editRedirect) {
        return (
            <Redirect
                to={{
                    pathname: "/employee-edit",
                    state: { selectedUser: user },
                }}
            />
        );
    }

    return (
        <div className="container-fluid pt-3">
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header
                            style={{
                                backgroundColor: "#515e73",
                                color: "white",
                                fontSize: "17px",
                            }}
                        >
                            Employee Detail
                            <Form className="float-right">
                <span style={{ cursor: "pointer" }} onClick={handleEdit}>
                  <i className="far fa-edit"></i> Edit
                </span>
                            </Form>
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
                                                src={process.env.PUBLIC_URL + "/user-128.png"}
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
                                                    <Card.Text id="emp-view-personal">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Date of Birth:
                                                            </Form.Label>
                                                            <span>{userPersonalInfo.dateOfBirth}</span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">Gender:</Form.Label>
                                                            <span>{userPersonalInfo.gender}</span>
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
                                                    <Card.Text id="emp-view-contact">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">Location:</Form.Label>
                                                            <span>
                                {userPersonalInfo.country},{" "}
                                                                {userPersonalInfo.city}
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
                                                                {userPersonalInfo.phone
                                                                    ? `(${userPersonalInfo.phone})`
                                                                    : null}
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
                                                    <Card.Text id="emp-view-bank">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Bank Name:
                                                            </Form.Label>
                                                            <span>{userFinancialInfo.bankName}</span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Account Name:
                                                            </Form.Label>
                                                            <span>{userFinancialInfo.accountName}</span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Account Number:
                                                            </Form.Label>
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
                </Col>
            </Row>
        </div>
    );
};

export default EmployeeView;
