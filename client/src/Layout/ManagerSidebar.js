import React, { useState, useEffect } from "react";
import { loadTree } from '../menuTreeHelper';
import { NavLink } from 'react-router-dom';

const ManagerSidebar = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadTree();
  }, []);

  return (
      <aside className="main-sidebar sidebar-light-primary elevation-2" style={{ backgroundColor: '#f4f6f9', color: '#333' }}>
        <a href="/" className="brand-link" style={{ textAlign: 'center', fontWeight: 'bold' }}>
          <span className="brand-text ml-1" style={{ fontSize: '1.25rem', color: '#007bff' }}>WorkSphere Manager</span>
        </a>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                  src={process.env.PUBLIC_URL + '/user-64.png'}
                  className="img-circle elevation-1"
                  alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block" style={{ color: '#007bff', fontWeight: '500' }}>
                {user.fullname}
              </a>
            </div>
          </div>
          <nav className="mt-2">
            <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
            >
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                  <i className="nav-icon fas fa-tachometer-alt" style={{ color: '#007bff' }} />
                  <p>
                    Dashboard
                    <span className="right badge badge-primary">Home</span>
                  </p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/employee-list" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                  <i className="nav-icon fas fa-users" style={{ color: '#007bff' }} />
                  <p>
                    My Employees
                  </p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/job-list" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                  <i className="nav-icon fas fa-briefcase" style={{ color: '#007bff' }} />
                  <p>
                    Job List
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink to="/fake-url" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                  <i className="nav-icon fa fa-rocket" style={{ color: '#007bff' }} />
                  <p>
                    Applications
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                      <i className="fa fa-plus nav-icon" style={{ color: '#007bff' }} />
                      <p>Add Application</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                      <i className="fas fa-list-ul nav-icon" style={{ color: '#007bff' }} />
                      <p>Application List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink exact to="/announcement" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                  <i className="nav-icon fa fa-bell" style={{ color: '#007bff' }} />
                  <p>
                    Announcements
                  </p>
                </NavLink>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
  );
};

export default ManagerSidebar;
