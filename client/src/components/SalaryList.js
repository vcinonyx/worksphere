import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

const SalaryList = () => {
    const [personalFinancialInfo, setPersonalFinancialInfo] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editRedirect, setEditRedirect] = useState(false);
    const [viewRedirect, setViewRedirect] = useState(false);

    useEffect(() => {
        axios({
            method: 'get',
            url: '/api/personal/financial-info',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setPersonalFinancialInfo(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const onEdit = (financialInfo) => (event) => {
        event.preventDefault();
        setSelectedUser(financialInfo.user);
        setEditRedirect(true);
    };

    const onView = (user) => (event) => {
        event.preventDefault();
        setSelectedUser(user);
        setViewRedirect(true);
    };

    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: '6px 6px 6px 6px'
                }
            }
        }
    });

    return (
        <div className="container-fluid pt-4">
            {editRedirect && (<Redirect to={{ pathname: '/salary-details', state: { selectedUser } }} />)}
            {viewRedirect && (<Redirect to={{ pathname: '/salary-view', state: { selectedUser } }} />)}
            <div className="col-sm-12">
                <Card>
                    <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
                        <div className="panel-title">
                            <strong>List of Employees and Their Salaries</strong>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ThemeProvider theme={theme}>
                            <MaterialTable
                                columns={[
                                    { title: 'EMP ID', field: 'user.id' },
                                    { title: 'Full Name', field: 'user.fullName' },
                                    { title: 'Gross Salary', field: 'salaryGross' },
                                    { title: 'Deductions', field: 'deductionTotal' },
                                    { title: 'Net Salary', field: 'salaryNet' },
                                    { title: 'Emp Type', field: 'employmentType' },
                                    {
                                        title: 'View',
                                        render: rowData => (
                                            <Form>
                                                <Button size="sm" variant="info" onClick={onView(rowData)}><i className="far fa-address-card"></i></Button>
                                            </Form>
                                        )
                                    },
                                    {
                                        title: 'Action',
                                        render: rowData => (
                                            <>
                                                <Button size="sm" variant="info" className="mr-2" onClick={onEdit(rowData)}><i className="far fa-edit"></i>Edit</Button>
                                            </>
                                        )
                                    }
                                ]}
                                data={personalFinancialInfo}
                                options={{
                                    rowStyle: (rowData, index) => {
                                        if (index % 2) {
                                            return { backgroundColor: '#f2f2f2' };
                                        }
                                    },
                                    pageSize: 10,
                                    pageSizeOptions: [10, 20, 30, 50, 75, 100]
                                }}
                                title="Employees"
                            />
                        </ThemeProvider>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default SalaryList;
