import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [paymentData, setPaymentData] = useState({
        paymentType: "",
        paymentMonth: null,
        paymentDate: moment().format("YYYY-MM-DD"),
        paymentFine: 0,
        paymentAmount: 0,
        comments: "",
        jobId: "",
    });
    const [hasError, setHasError] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [completed, setCompleted] = useState(false);

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: "6px 6px 6px 6px",
                },
            },
        },
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = () => {
        axios
            .get("/api/payments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                setPayments(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handleDateChange = (date) => {
        setPaymentData({ ...paymentData, paymentMonth: date });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/api/payments", paymentData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => {
                setCompleted(true);
                setHasError(false);
                fetchPayments();
            })
            .catch((err) => {
                setHasError(true);
                setErrMsg(err.response?.data?.message || "An error occurred");
            });
    };

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                {hasError && <Alert variant="danger">{errMsg}</Alert>}
                {completed && <Alert variant="success">Payment has been added successfully.</Alert>}

                <div className="col-sm-12">
                    <Card>
                        <Card.Header>Add Payment</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Payment Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="paymentType"
                                        value={paymentData.paymentType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Payment Month</Form.Label>
                                    <DatePicker
                                        selected={paymentData.paymentMonth}
                                        onChange={handleDateChange}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Payment Fine</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="paymentFine"
                                        value={paymentData.paymentFine}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Payment Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="paymentAmount"
                                        value={paymentData.paymentAmount}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="comments"
                                        value={paymentData.comments}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Job ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="jobId"
                                        value={paymentData.jobId}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button type="submit">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-12">
                    <Card>
                        <Card.Header>Payment History</Card.Header>
                        <Card.Body>
                            <ThemeProvider theme={theme}>
                                <MaterialTable
                                    columns={[
                                        {
                                            title: "Payment Month",
                                            render: (rowData) =>
                                                moment(rowData.paymentMonth).format("MM/YYYY"),
                                        },
                                        { title: "Payment Date", field: "paymentDate" },
                                        { title: "Payment Fine", field: "paymentFine" },
                                        { title: "Payment Amount", field: "paymentAmount" },
                                        { title: "Comments", field: "comments" },
                                        { title: "Job ID", field: "jobId" },
                                    ]}
                                    data={payments}
                                    options={{
                                        pageSize: 10,
                                        pageSizeOptions: [10, 20, 30],
                                        rowStyle: (_, index) => ({ backgroundColor: index % 2 ? "#f9f9f9" : "#ffffff" }),
                                    }}
                                    title="Payments"
                                />
                            </ThemeProvider>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Payment;
