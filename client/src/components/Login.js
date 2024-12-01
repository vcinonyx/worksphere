import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);

  const passwordVisibilityHandler = () => {
    setPasswordShow(!passwordShow);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username,
      password,
    };

    try {
      const res = await axios.post("/login", user);
      localStorage.setItem("token", res.data.token);
      setDone(true);
    } catch (err) {
      console.error(err.response);
      setHasError(true);
      setErrorMessage(err.response.data.message);
    }
  };

  if (done) {
    return <Redirect to="/" />;
  }

  return (
      <div className="register-box">
        <div className="register-logo">
          <a href="/">
            <b>Work</b>Sphere
          </a>
        </div>
        <div className="card">
          <div className="card-body register-card-body">
            {hasError && <Alert variant="danger">{errorMessage}</Alert>}
            <p className="login-box-msg">Login</p>
            <form onSubmit={onSubmit}>
              <div>
                <div className="input-group mb-3">
                  <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                      type={passwordShow ? "text" : "password"}
                      className="form-control"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                  <div className="input-group-append">
                    <div className="input-group-text">
                    <span
                        className={passwordShow ? "fas fa-eye" : "fas fa-eye-slash"}
                        onClick={passwordVisibilityHandler}
                        style={{ cursor: "pointer" }}
                    />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </div>
              </div>
            </form>
            <a href="/register" className="text-center mt-1">
              Don't have an account? Register
            </a>
            <hr className="mt-3" />
          </div>
        </div>
      </div>
  );
};

export default Login;
