import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const SalaryView = ({ location }) => {
    const [user, setUser] = useState(null);
    const [currentJobTitle, setCurrentJobTitle] = useState(null);
    const [falseRedirect, setFalseRedirect] = useState(false);

    useEffect(() => {
        if (location.state) {
            axios
                .get(`api/users/${location.state.selectedUser.user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                .then((res) => {
                    const userData = res.data;
                    setUser(userData);

                    if (userData.jobs) {
                        const currentJob = userData.jobs.find(
                            (job) =>
                                new Date(job.startDate).setHours(0) <= new Date() &&
                                new Date(job.endDate).setHours(24) >= new Date()
                        );
                        if (currentJob) {
                            setCurrentJobTitle(currentJob.jobTitle);
                        }
                    }
                })
                .catch((err) => console.error(err));
        } else {
            setFalseRedirect(true);
        }
    }, [location.state]);

    if (falseRedirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="container-fluid pt-3">
            {user && (
                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Header style={{ backgroundColor: "#515e73", color: "white", fontSize: "17px" }}>
                                Employee Salary Detail
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
                                                    alt="User Avatar"
                                                />
                                            </Col>
                                            <Col className="pt-4" lg={9}>
                                                <div className="emp-view-list">
                                                    <ul>
                                                        <li>
                                                            <span>Employee ID: </span> {user.id}
                                                        </li>
                                                        <li>
                                                            <span>Department: </span> {user.department.departmentName}
                                                        </li>
                                                        <li>
                                                            <span>Job Title: </span> {currentJobTitle}
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
                                        <Row className="pt-4">
                                            <Col sm={6}>
                                                <Card className="secondary-card sal-view">
                                                    <Card.Header>Salary Details</Card.Header>
                                                    <Card.Body>
                                                        <Card.Text id="sal-view-details">
                                                            <Form.Group as={Row}>
                                                                <Form.Label className="label">Employment Type:</Form.Label>
                                                                <span>{user.user_financial_info.employmentType}</span>
                                                            </Form.Group>
                                                            <Form.Group as={Row}>
                                                                <Form.Label className="label">Basic Salary:</Form.Label>
                                                                <span>€ {user.user_financial_info.salaryBasic}</span>
                                                            </Form.Group>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col sm={6}>
                                                <Card className="secondary-card sal-view">
                                                    <Card.Header>Allowances</Card.Header>
                                                    <Card.Body>
                                                        <Card.Text id="sal-view-allowances">
                                                            {[
                                                                { label: "House Rent Allowance", value: "allowanceHouseRent" },
                                                                { label: "Medical Allowance", value: "allowanceMedical" },
                                                                { label: "Special Allowance", value: "allowanceSpecial" },
                                                                { label: "Fuel Allowance", value: "allowanceFuel" },
                                                                { label: "Phone Bill Allowance", value: "allowancePhoneBill" },
                                                                { label: "Other Allowance", value: "allowanceOther" },
                                                                { label: "Total Allowance", value: "allowanceTotal" },
                                                            ].map(({ label, value }) => (
                                                                <Form.Group as={Row} key={value}>
                                                                    <Form.Label className="label">{label}:</Form.Label>
                                                                    <span>€ {user.user_financial_info[value]}</span>
                                                                </Form.Group>
                                                            ))}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={6}>
                                                <Card className="secondary-card">
                                                    <Card.Header>Deductions</Card.Header>
                                                    <Card.Body>
                                                        <Card.Text id="sal-view-deductions">
                                                            {[
                                                                { label: "Tax Deduction", value: "deductionTax" },
                                                                { label: "Other Deduction", value: "deductionOther" },
                                                                { label: "Total Deduction", value: "deductionTotal" },
                                                            ].map(({ label, value }) => (
                                                                <Form.Group as={Row} key={value}>
                                                                    <Form.Label className="label">{label}:</Form.Label>
                                                                    <span>€ {user.user_financial_info[value]}</span>
                                                                </Form.Group>
                                                            ))}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col sm={6}>
                                                <Card className="secondary-card">
                                                    <Card.Header>Total Salary Details</Card.Header>
                                                    <Card.Body>
                                                        <Card.Text id="sal-view-total">
                                                            {[
                                                                { label: "Gross Salary", value: "salaryGross" },
                                                                { label: "Total Deduction", value: "deductionTotal" },
                                                                { label: "Net Salary", value: "salaryNet" },
                                                            ].map(({ label, value }) => (
                                                                <Form.Group as={Row} key={value}>
                                                                    <Form.Label className="label">{label}:</Form.Label>
                                                                    <span>€ {user.user_financial_info[value]}</span>
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
            )}
        </div>
    );
};

export default SalaryView;
