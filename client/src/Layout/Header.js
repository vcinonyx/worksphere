import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import NewPasswordModal from '../components/NewPasswordModal';

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    setCompleted(true);
  };

  const newPassword = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {completed && <Redirect to="/" />}
        {showModal && <NewPasswordModal show={true} onHide={closeModal} />}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fas fa-user" />
              <span className="pl-1">{JSON.parse(localStorage.getItem('user')).fullname}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-header">Options</span>
              <div className="dropdown-divider" />
              <a onClick={newPassword} href="#" className="dropdown-item">
                <i className="fas fa-key mr-2" /> Change Password
              </a>
              <div className="dropdown-divider" />
              <a onClick={onLogout} href="#" className="dropdown-item">
                <i className="fas fa-sign-out-alt mr-2" /> Log out
              </a>
            </div>
          </li>
        </ul>
      </nav>
  );
};

export default Header;
