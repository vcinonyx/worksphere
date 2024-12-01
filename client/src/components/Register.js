import React, { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordCheckShow, setPasswordCheckShow] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordVisibilityHandler = () => {
    setPasswordShow(!passwordShow);
  };

  const passwordVisibilityHandlerCheck = () => {
    setPasswordCheckShow(!passwordCheckShow);
  };

  const onChange = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "checkPassword":
        setCheckPassword(value);
        break;
      case "fullname":
        setFullname(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (password !== checkPassword) {
      alert("Passwords don't match");
    } else {
      const newUser = {
        username,
        password,
        fullname,
      };

      axios({
        method: "post",
        url: "/register",
        data: newUser,
      })
          .then((res) => {
            setCompleted(true);
            setHasError(false);
          })
          .catch((err) => {
            setHasError(true);
            setErrorMessage(err.response.data.message);
          });
    }
  };

  return (
      <div className="register-box">
        <div className="register-logo">
          <a href="../../index2.html">
            <b>Work</b>Sphere{" "}
          </a>
        </div>
        <div className="card">
          <div className="card-body register-card-body">
            {hasError ? (
                <Alert variant="danger">{errorMessage}</Alert>
            ) : null}
            {completed ? (
                <Alert variant="success">
                  You have been registered successfully. <NavLink to="/login">Go to Login.</NavLink>
                </Alert>
            ) : null}
            <p className="login-box-msg">Register</p>
            <form onSubmit={onSubmit}>
              <div>
                <div className="input-group mb-3">
                  <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      value={username}
                      onChange={onChange}
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
                      type="text"
                      className="form-control"
                      name="fullname"
                      placeholder="Fullname"
                      value={fullname}
                      onChange={onChange}
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
                      onChange={onChange}
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
                    />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                      type={passwordCheckShow ? "text" : "password"}
                      className="form-control"
                      name="checkPassword"
                      id="checkPassword"
                      placeholder="Retype Password"
                      value={checkPassword}
                      onChange={onChange}
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
                        className={passwordCheckShow ? "fas fa-eye" : "fas fa-eye-slash"}
                        onClick={passwordVisibilityHandlerCheck}
                    />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Register
                  </button>
                </div>
              </div>
            </form>
            <a href="/login" className="text-center mt-1">
              Already have an account? Login
            </a>
            <hr className="mt-3" />
            <p className="mb-0">by WorkSphere</p>
          </div>
        </div>
      </div>
  );
};

export default Register;
