import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './EmployeeStyles.css';

const { confirm } = Modal;

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/v1/admin/employees', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEmployees(response.data);
        } catch (error) {
            message.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this employee?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                return deleteEmployee(id);
            }
        });
    };

    const deleteEmployee = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/api/v1/admin/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            message.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            message.error('Failed to delete employee');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <>
                    {roles.map((role) => (
                        <Tag color={role === 'ROLE_ADMIN' ? 'volcano' : 'geekblue'} key={role}>
                            {role}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Edit', record.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="employee-container">
            <Card
                title="Manage Employees"
                className="employee-card"
                extra={
                    <Button
                        type="primary"
                        onClick={() => window.location.href = '/employee/add'}
                    >
                        Add New Employee
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={employees}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default ManageEmployees;