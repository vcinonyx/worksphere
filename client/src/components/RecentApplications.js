import * as React from "react";
import axios from "axios";

const RecentApplications = () => {
  const [recentApplications, setRecentApplications] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;

    // Fetch Applications Recent
    axios({
      method: "get",
      url: "/api/applications/recent",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
        .then((res) => {
          if (isMounted) {
            setRecentApplications(res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching recent applications:", error);
        });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
      <div className="card">
        <div className="mt-1" style={{ textAlign: "center" }}></div>
        <div>
          <ul>
            {recentApplications.map((app) => (
                <li
                    style={{ listStyle: "none", height: "50px" }}
                    key={app.id}
                    className="mt-1 mb-2"
                >
                  <h5>
                    <div className="float-left mr-1">
                      <img src={process.env.PUBLIC_URL + "/user-40.png"} alt="user" />
                    </div>
                    <span>{app.user.fullName} </span>
                    <small>({app.type})</small>
                    <div className="float-right mt-2 mr-3">
                      <small
                          style={{
                            color:
                                app.status === "Approved"
                                    ? "green"
                                    : app.status === "Rejected"
                                        ? "red"
                                        : "orange",
                          }}
                      >
                        {app.status}
                      </small>
                    </div>
                    <p></p>
                  </h5>
                  <hr className="mt-2 mb-2" />
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default RecentApplications;