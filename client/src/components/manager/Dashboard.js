import React, { useState, useEffect } from "react";
import "../../App.css";
import Infobox from "../infobox";
import Calendar from "../Calendar";
import RecentApplications from "../manager/RecentApplications";
import RecentAnnouncements from "../RecentAnnouncementsManagerEmp";
import axios from "axios";

const DashboardManager = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const departmentId = JSON.parse(localStorage.getItem("user")).departmentId;

  useEffect(() => {
    // Fetch Employees Total
    axios
        .get(`/api/users/total/department/${departmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setTotalEmployees(parseInt(res.data, 10));
        })
        .catch((err) => console.error(err));

    // Fetch Expenses Total
    axios
        .get(`/api/expenses/year/2021/department/${departmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          const expensesArray = res.data;
          if (expensesArray.length > 0) {
            const totalExpenses = expensesArray.reduce(
                (acc, expense) => acc + parseInt(expense.expenses, 10),
                0
            );
            setTotalExpenses(totalExpenses);
          }
        })
        .catch((err) => console.error(err));
  }, [departmentId]);

  return (
      <div>
        {/* First Row with small info-boxes */}
        <div className="row pt-4">
          {/* First info-box */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Infobox
                title="Department Employees"
                description={totalEmployees}
                color="bg-success"
                icon="fa fa-users"
            />
          </div>
          {/* Second info-box */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Infobox
                title="Department Expenses"
                description={`${totalExpenses}€`}
                color="bg-warning"
                icon="fa fa-shopping-cart"
            />
          </div>
        </div>
        {/* Second Row with Calendar and Recent Activities */}
        <div className="row pt-4">
          {/* Calendar */}
          <div className="col-sm-6">
            <Calendar />
          </div>
          {/* Recent Applications and Announcements */}
          <div className="col-md-6">
            <div className="panel panel-default">
              <div
                  className="panel-heading with-border"
                  style={{ backgroundColor: "#515e73", color: "white" }}
              >
                <h3 className="panel-title">Recent Applications</h3>
              </div>
              <RecentApplications />
            </div>
            <div className="panel panel-default">
              <div
                  className="panel-heading with-border"
                  style={{ backgroundColor: "#515e73", color: "white" }}
              >
                <h3 className="panel-title">Recent Announcements</h3>
              </div>
              <RecentAnnouncements />
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardManager;
