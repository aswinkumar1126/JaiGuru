import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card } from 'antd';
import axiosInstance from '../../../api/axiosInstance';
import './EmployeeStyles.css';

const { Option } = Select;

const AddEmployee = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const payload = {
                username: values.username,
                password: values.password,
                email: values.email,
                roles: typeof values.roles === 'string' ? values.roles : values.roles[0],
                contactNumber: values.contactNumber,
            };

            console.log('Payload:', payload);

            const response = await axiosInstance.post(
                '/admin/create-employee',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                message.success('Employee created successfully!');
                form.resetFields();
                navigate('/employee/manage');
            }
        } catch (error) {
            console.error('API Error:', error.response);
            message.error(error.response?.data?.message || 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-container">
            <Card title="Add New Employee" className="employee-card">
                <Form
                    form={form}
                    name="addEmployee"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input the username!' },
                            { min: 3, message: 'Username must be at least 3 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input the password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contactNumber"
                        rules={[
                            { required: true, message: 'Please input the contact number!' }
                        ]}
                    >
                        <Input placeholder="Enter contact number" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="roles"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select role">
                            <Option value="ROLE_ADMIN">Admin</Option>
                            <Option value="ROLE_EMPLOYEE">Employee</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Add Employee
                        </Button>
                        <Button
                            style={{ marginLeft: 10 }}
                            onClick={() => navigate('/employee/manage')}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddEmployee;
