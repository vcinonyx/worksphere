import React, { Component } from "react";

import "../../App.css";
import CalendarView from "../Calendar";
import RecentApplicationList from "../employee/RecentApplications";
import AnnouncementsList from "../RecentAnnouncementsManagerEmp";
import DashboardView from "./EmployeeViewDashboard";

export default class EmployeeDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeCount: 0,
      totalCosts: 0,
      paymentCount: 0,
      recentRequests: [],
    };
  }

  componentDidMount() {
    const deptId = JSON.parse(localStorage.getItem("user")).departmentId;

    // Simulating a fetch logic if needed in the future
  }

  render() {
    return (
        <div>
          {/* First Section with Dashboard View */}
          <div className="row pt-4">
            {/* Left Panel: Dashboard and Announcements */}
            <div className="col-sm-6">
              <DashboardView />
              <div className="panel panel-default">
                <div
                    className="panel-heading with-border"
                    style={{ backgroundColor: "#515e73", color: "white" }}
                >
                  <h3 className="panel-title">Latest Announcements</h3>
                </div>
                <AnnouncementsList />
              </div>
            </div>
            {/* Right Panel: Calendar and Recent Applications */}
            <div className="col-md-6">
              <CalendarView />
              <div className="panel panel-default">
                <div
                    className="panel-heading with-border"
                    style={{ backgroundColor: "#515e73", color: "white" }}
                >
                  <h3 className="panel-title">Recent Applications</h3>
                </div>
                <RecentApplicationList />
              </div>
            </div>
          </div>
        </div>
    );
  }
}
