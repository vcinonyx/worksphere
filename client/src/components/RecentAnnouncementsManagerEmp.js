import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentAnnouncements = () => {
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const deptId = user?.departmentId;
        const response = await axios.get(
            `/api/departments/announcements/recent/department/${deptId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
        );
        setRecentAnnouncements(response.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
      <div className="card">
        <ul>
          {recentAnnouncements.map((announcement) => (
              <li
                  style={{ listStyle: "none" }}
                  key={announcement.id}
                  className="mb-2 mt-1"
              >
                <div className="float-left mr-2">
                  <time className="icon p-0">
                    <em>
                      {days[new Date(announcement.createdAt).getDay()]}
                    </em>
                    <strong>
                      {monthNames[new Date(announcement.createdAt).getMonth()]}
                    </strong>
                    <span>
                  {new Date(announcement.createdAt).getDate()}
                </span>
                  </time>
                </div>
                <span>
              <strong>{announcement.announcementTitle}</strong>
            </span>
                <br className="p-1" />
                <small>{announcement.announcementDescription}</small>
                <hr className="pt-2 pb-1 mb-0" />
              </li>
          ))}
        </ul>
      </div>
  );
};

export default RecentAnnouncements;