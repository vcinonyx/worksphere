import React, { useState, useEffect } from "react";
import "../App.css";
import Infobox from "./infobox";
import Calendar from "./Calendar";
import RecentApplications from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import axios from "axios";

const Dashboard = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);

    useEffect(() => {
        const token = `Bearer ${localStorage.getItem("token")}`;

        // Fetch Employees Total
        axios
            .get("/api/users/total", { headers: { Authorization: token } })
            .then((res) => setTotalEmployees(parseInt(res.data)))
            .catch(console.error);

        // Fetch Payments Total
        axios
            .get("/api/payments/year/2024", { headers: { Authorization: token } })
            .then((res) => {
                const sum = res.data.reduce((a, b) => a + parseInt(b.expenses), 0);
                setTotalPayments(sum);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="dashboard-container">
            {/* Summary Section */}
            <section className="dashboard-content">
                <div className="content-left">
                    {/* Calendar Section */}
                    <div className="dashboard-panel calendar-panel">
                        <h3>Calendar</h3>
                        <Calendar />
                    </div>
                </div>

                <div className="content-right">
                    {/* Info Boxes */}
                    <section className="dashboard-summary">
                        <Infobox
                            title="Total Employees"
                            description={totalEmployees}
                            color="info-box-green"
                            icon="fa fa-users"
                        />
                        <Infobox
                            title="Total Payments"
                            description={`${totalPayments} €`}
                            color="info-box-red"
                            icon="fa fa-money-check"
                        />
                    </section>

                    {/* Announcements */}
                    <div className="dashboard-panel">
                        <h3>Recent Announcements</h3>
                        <RecentAnnouncements />
                    </div>

                    {/* Applications */}
                    <div className="dashboard-panel">
                        <h3>Recent Applications</h3>
                        <RecentApplications />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
