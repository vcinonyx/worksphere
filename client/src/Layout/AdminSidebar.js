import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import {NavLink} from 'react-router-dom'

export default class AdminSidebar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem('user'))
    this.setState({user: userData})
    loadTree();
  }

  render() {
    return (
      <aside className="main-sidebar sidebar-light-primary elevation-2" style={{backgroundColor: '#f4f6f9', color: '#333'}}>
        {/* Brand Logo */}
        <a href="/" className="brand-link" style={{textAlign: 'center', fontWeight: 'bold'}}>
          <span className="brand-text ml-1" style={{fontSize: '1.25rem', color: '#007bff'}}>WorkSphere Admin</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={process.env.PUBLIC_URL + '/user-64.png'}
                className="img-circle elevation-1"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block" style={{color: '#007bff', fontWeight: '500'}}>
                {this.state.user.fullname}
              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fas fa-tachometer-alt" style={{color: '#007bff'}}/>
                  <p>
                    Home
                    <span className="right badge badge-primary">Home</span>
                  </p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/departments" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fa fa-building" style={{color: '#007bff'}} />
                  <p>
                    Departments
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink to="/fake-url" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fa fa-user" style={{color: '#007bff'}} />
                  <p>
                    Employee
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/employee-add" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fa fa-user-plus nav-icon" style={{color: '#007bff'}} />
                      <p>Add Employee</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employee-list" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-users nav-icon" style={{color: '#007bff'}} />
                      <p>Employee List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to="/job-list" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fas fa-briefcase" style={{color: '#007bff'}} />
                  <p>
                    Job List
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink to="/fake-url" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fa fa-rocket" style={{color: '#007bff'}} />
                  <p>
                    Applications
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fa fa-plus nav-icon" style={{color: '#007bff'}} />
                      <p>Add Application</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-list-ul nav-icon" style={{color: '#007bff'}} />
                      <p>Application List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink to="/fake-url" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fas fa-euro-sign" style={{color: '#007bff'}} />
                  <p>
                    Payment Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/salary-details" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-euro-sign nav-icon" style={{color: '#007bff'}} />
                      <p>Manage Salary Details</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/salary-list" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-users nav-icon" style={{color: '#007bff'}} />
                      <p>Employee Salary List</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/payment" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-money-check nav-icon" style={{color: '#007bff'}} />
                      <p>Make Payment</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/job-offers" className="nav-link" activeClassName="active" style={{ color: '#333' }}>
                    <i className="fas fa-users nav-icon" style={{ color: '#007bff' }} />
                        <p>Job Offers</p>
                        </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                {/* <NavLink to="/fake-url" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fas fa-money-bill" style={{color: '#007bff'}} />
                  <p>
                    Expense Management
                    <i className="right fas fa-angle-left" />
                  </p> */}
                {/* </NavLink> */}
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/expense" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-shopping-cart nav-icon" style={{color: '#007bff'}} />
                      <p>Make Expense</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/expense-report" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                      <i className="fas fa-file-invoice nav-icon" style={{color: '#007bff'}} />
                      <p>Expense Report</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link" activeClassName="active" style={{color: '#333'}}>
                  <i className="nav-icon fa fa-bell" style={{color: '#3a638f'}} />
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
  }
}
