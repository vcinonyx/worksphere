import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import AdminSidebar from "./Layout/AdminSidebar";
import ManagerSidebar from "./Layout/ManagerSidebar";
import EmployeeSidebar from './Layout/EmployeeSidebar'
import Dashboard from "./components/Dashboard";
import DashboardManager from './components/manager/Dashboard'
import DashboardEmployee from './components/employee/Dashboard'
import Layout from "./Layout/Layout";
import EmployeeList from "./components/EmployeeList";
import EmployeeListManager from "./components/manager/EmployeeList";
import EmployeeAdd from "./components/EmployeeAdd";
import EmployeeView from './components/EmployeeView'
import EmployeeViewEmployee from './components/employee/EmployeeView'
import EmployeeEdit from "./components/EmployeeEdit";
import DepartmentList from "./components/DepartmentList"
import ApplicationList from "./components/ApplicationList"
import ApplicationListManager from "./components/manager/ApplicationList"
import ApplicationListEmployee from './components/employee/ApplicationList'
import Application from "./components/Application"
import SalaryList from './components/SalaryList'
import SalaryViewManager from './components/manager/SalaryView'
import Payment from './components/Payment'
import Announcement from './components/Announcement'
import AnnouncementManager from './components/manager/Announcement'
import AnnouncementEmployee from './components/employee/Announcement'
import Register from "./components/Register";
import requireAuth from "./requireAuth";
import Login from "./components/Login";
import JobList from "./components/JobList";
import JobListManager from './components/manager/JobList'
import JobOfferDetails from "./components/JobOfferDetails";
import EmployeeViewManager from './components/manager/EmployeeView'


export default class App extends Component {
  render() {
    return (
      <>
        <Router>
            <Switch>
              <Route exact path="/login" component={LoginContainer} />
              <Route exact path="/register" component={RegisterContainer} />
              <Route path="/" component={requireAuth(DefaultContainer)} />
            </Switch>
        </Router>
      </>
    )
  }
}

const LoginContainer = () => (
  <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: "600px"}}>
    <Route exact path="/" render={() => <Redirect to="/login" />} />
    <Route path="/login" component={Login} />
  </div>
)

const RegisterContainer = () => (
  <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: "600px"}}>
    <Route exact path="/" render={() => <Redirect to="/register" />} />
    <Route path="/register" component={Register} />
  </div>
)

const DefaultContainer = () => (
  <div>
    {JSON.parse(localStorage.getItem('user')).role === "ROLE_ADMIN" ? (
      AdminContainer()
    ) : JSON.parse(localStorage.getItem('user')).role === "ROLE_MANAGER" ? (
      ManagerContainer()
    ) : JSON.parse(localStorage.getItem('user')).role === "ROLE_EMPLOYEE" ? (
      EmployeeContainer()
    ) : null}
  </div>
)

const AdminContainer = () => (
  <div>
    <Header />
    <AdminSidebar />
    <Layout>
      <Switch>
        <Route exact path="/" component={requireAuth(Dashboard)} />
        <Route exact path="/employee-list" component={requireAuth(EmployeeList)} />
        <Route exact path="/employee-add" component={requireAuth(EmployeeAdd)} />
        <Route exact path="/employee-view" component={requireAuth(EmployeeView)} />
        <Route exact path="/employee-edit" component={requireAuth(EmployeeEdit)} />
        <Route exact path="/departments" component={requireAuth(DepartmentList)} />
        <Route exact path="/job-list" component={requireAuth(JobList)} />
        <Route exact path="/application-list" component={requireAuth(ApplicationList)} />
        <Route exact path="/application" component={requireAuth(Application)} />
        <Route exact path="/salary-list" component={requireAuth(SalaryList)} />
        <Route exact path="/payment" component={requireAuth(Payment)} />
        <Route exact path="/job-offers" component={requireAuth(JobOffersList)} />
        <Route exact path="/joboffer-details/" component={requireAuth(JobOfferDetails)} />
        <Route exact path="/announcement" component={requireAuth(Announcement)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
)

const ManagerContainer = () => (
  <div>
    <Header />
    <ManagerSidebar />
    <Layout>
      <Switch>
        <Route exact path="/" component={requireAuth(DashboardManager)} />
        <Route exact path="/employee-list" component={requireAuth(EmployeeListManager)} />
        <Route exact path="/employee-view" component={requireAuth(EmployeeViewManager)} />
        <Route exact path="/job-list" component={requireAuth(JobListManager)} />
        <Route exact path="/application-list" component={requireAuth(ApplicationListManager)} />
        <Route exact path="/application" component={requireAuth(Application)} />
        <Route exact path="/salary-view" component={requireAuth(SalaryViewManager)} />
        <Route exact path="/announcement" component={requireAuth(AnnouncementManager)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
)

const EmployeeContainer = () => (
  <div>
    <Header />
    <EmployeeSidebar />
    <Layout>
      <Switch>
        <Route exact path="/" component={requireAuth(DashboardEmployee)} />
        <Route exact path="/employee-view" component={requireAuth(EmployeeViewEmployee)} />
        <Route exact path="/application-list" component={requireAuth(ApplicationListEmployee)} />
        <Route exact path="/application" component={requireAuth(Application)} />
        <Route exact path="/announcement" component={requireAuth(AnnouncementEmployee)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
)
