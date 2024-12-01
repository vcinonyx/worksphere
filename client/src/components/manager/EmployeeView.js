import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const EmployeeView = ({ location }) => {
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
        if (location.state) {
            axios({
                method: "get",
                url: `api/users/${location.state.selectedUser.id}`,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
                .then((res) => {
                    const user = res.data;
                    setUser(user);

                    if (user.jobs) {
                        user.jobs.forEach((job) => {
                            if (
                                new Date(job.startDate) <= Date.now() &&
                                new Date(job.endDate) >= Date.now()
                            ) {
                                setJob(job);
                            }
                        });
                    }
                    if (user.department) {
                        setDepartment(user.department);
                    }
                    if (user.user_personal_info) {
                        if (user.user_personal_info.dateOfBirth) {
                            user.user_personal_info.dateOfBirth = moment(
                                user.user_personal_info.dateOfBirth
                            ).format("D MMM YYYY");
                        }
                        setUserPersonalInfo(user.user_personal_info);
                    }
                    if (user.user_financial_info) {
                        setUserFinancialInfo(user.user_financial_info);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            setFalseRedirect(true);
        }
    }, [location.state]);

    const handleEdit = () => {
        setEditRedirect(true);
    };

    if (falseRedirect) return <Redirect to="/" />;
    if (editRedirect)
        return <Redirect to={{ pathname: "/employee-edit", state: { selectedUser: user } }} />;

    return (
        <div className="container-fluid pt-3">
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header style={{ backgroundColor: "#515e73", color: "white", fontSize: "17px" }}>
                            Employee Detail
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
                                                        {Object.entries(userPersonalInfo).map(([key, value]) => (
                                                            <Form.Group as={Row} key={key}>
                                                                <Form.Label className="label">
                                                                    {key.replace(/([A-Z])/g, " $1")}:
                                                                </Form.Label>
                                                                <span>{value}</span>
                                                            </Form.Group>
                                                        ))}
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
                                                            <Form.Label className="label">Location: </Form.Label>
                                                            <span>
                                {userPersonalInfo.country}, {userPersonalInfo.city}
                              </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">Address: </Form.Label>
                                                            <span>{userPersonalInfo.address}</span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">Mobile: </Form.Label>
                                                            <span>
                                {userPersonalInfo.mobile}
                                                                {userPersonalInfo.phone
                                                                    ? ` (${userPersonalInfo.phone})`
                                                                    : null}
                              </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">Email Address: </Form.Label>
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
                                                        {Object.entries(userFinancialInfo).map(([key, value]) => (
                                                            <Form.Group as={Row} key={key}>
                                                                <Form.Label className="label">
                                                                    {key.replace(/([A-Z])/g, " $1")}:
                                                                </Form.Label>
                                                                <span>{value}</span>
                                                            </Form.Group>
                                                        ))}
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
