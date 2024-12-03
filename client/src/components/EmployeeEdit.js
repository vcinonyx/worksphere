import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

export default class EmployeeEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        id: null,
        fullName: "",
        role: "",
        active: "",
        departmentId: "",
      },
      userPersonalInfo: {
        dateOfBirth: null,
        gender: "",
        maritalStatus: "",
        fatherName: "",
        address: "",
        city: "",
        country: "",
        mobile: "",
        phone: "",
        emailAddress: "",
      },
      userFinancialInfo: {
        bankName: "",
        accountName: "",
        accountNumber: "",
        iban: "",
      },
      departments: [],
      job: {
        jobTitle: "",
        startDate: null,
        endDate: null,
      },
      hasError: false,
      errMsg: "",
      completed: false,
      falseRedirect: false,
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.fetchUserData();
      this.fetchDepartments();
    } else {
      this.setState({ falseRedirect: true });
    }
  }

  fetchUserData = () => {
    const userId = this.props.location.state.selectedUser.id;
    axios
        .get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          const user = res.data;
          const job = user.jobs.find(
              (job) =>
                  new Date(job.startDate) <= Date.now() &&
                  new Date(job.endDate) >= Date.now()
          );

          this.setState({
            user,
            userPersonalInfo: user.user_personal_info || {},
            userFinancialInfo: user.user_financial_info || {},
            job: job
                ? {
                  ...job,
                  startDate: moment(job.startDate).toDate(),
                  endDate: moment(job.endDate).toDate(),
                }
                : this.state.job,
          });
        })
        .catch((err) => console.error(err));
  };

  fetchDepartments = () => {
    axios
        .get("/api/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          this.setState({ departments: res.data });
        })
        .catch((err) => console.error(err));
  };

  handleInputChange = (section) => (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  handleDateChange = (section, field) => (date) => {
    this.setState((prevState) => ({
      [section]: {
        ...prevState[section],
        [field]: date,
      },
    }));
  };

  renderDepartmentsDropdown = () => {
    const { departments } = this.state;
    if (!departments.length) return <option>Loading...</option>;
    return departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.departmentName}
        </option>
    ));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user, userPersonalInfo, userFinancialInfo, job } = this.state;

    this.setState({ hasError: false, errMsg: "", completed: false });

    const userPayload = {
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId,
      active: user.active,
    };

    axios
        .put(`/api/users/${user.id}`, userPayload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          return axios.put(
              `/api/personal/info/${userPersonalInfo.id}`,
              {
                ...userPersonalInfo,
                dateOfBirth: moment(userPersonalInfo.dateOfBirth).format(
                    "YYYY-MM-DD"
                ),
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
        })
        .then(() => {
          return axios.put(
              `/api/personal/financial-info/${userFinancialInfo.id}`,
              userFinancialInfo,
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
        })
        .then(() => {
          if (job.id) {
            return axios.put(
                `/api/jobs/${job.id}`,
                {
                  jobTitle: job.jobTitle,
                  startDate: moment(job.startDate).format("YYYY-MM-DD"),
                  endDate: moment(job.endDate).format("YYYY-MM-DD"),
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
          }
        })
        .then(() => this.setState({ completed: true }))
        .catch((err) => {
          this.setState({ hasError: true, errMsg: err.response.data.message });
        });
  };

  render() {
    const {
      user,
      userPersonalInfo,
      userFinancialInfo,
      job,
      hasError,
      errMsg,
      completed,
      falseRedirect,
    } = this.state;

    if (falseRedirect) return <Redirect to="/" />;
    if (!user.id) return <p>Loading...</p>;

    return (
        <Form onSubmit={this.onSubmit}>
          <div className="container-fluid">
            {hasError && <Alert variant="danger">{errMsg}</Alert>}
            {completed && <Redirect to="/employee-list" />}

            <Card>
              <Card.Header>Edit Employee</Card.Header>
              <Card.Body>
                {/* Personal Details */}
                <Card className="mb-3">
                  <Card.Header>Personal Details</Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                          type="text"
                          name="fullName"
                          value={user.fullName}
                          onChange={this.handleInputChange("user")}
                          required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>
                      <DatePicker
                          selected={userPersonalInfo.dateOfBirth}
                          onChange={this.handleDateChange("userPersonalInfo", "dateOfBirth")}
                          className="form-control"
                          required
                      />
                    </Form.Group>
                    {/* Add More Fields as Needed */}
                  </Card.Body>
                </Card>

                {/* Submit Button */}
                <Button type="submit" variant="primary" block>
                  Update
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Form>
    );
  }
}
