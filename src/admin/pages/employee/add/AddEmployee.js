import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Card, Row, Col } from 'antd';
import { useCreateEmployee } from '../../../hooks/employee/useCreateEmployee';
import './EmployeeStyles.css';

const { Option } = Select;

const AddEmployee = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { mutate: createEmployee, isLoading } = useCreateEmployee();

    const onFinish = (values) => {
        createEmployee(values, {
            onSuccess: () => {
                form.resetFields(); // Clear form after successful creation
            }
        });
    };

    return (
        <div className="employee-container">
            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Card
                        title={<span className="card-title">Add New Employee</span>}
                        className="employee-card"
                        bordered={false}
                    >
                        <Form
                            form={form}
                            name="addEmployee"
                            onFinish={onFinish}
                            layout="vertical"
                            autoComplete="off"
                            className="employee-form"
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[
                                            { required: true, message: 'Please input the username!' },
                                            { min: 3, message: 'Username must be at least 3 characters!' }
                                        ]}
                                    >
                                        <Input placeholder="Enter username" size="large" className="form-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please input the email!' },
                                            { type: 'email', message: 'Please enter a valid email!' }
                                        ]}
                                    >
                                        <Input placeholder="Enter email" size="large" className="form-input" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Please input the password!' },
                                            { min: 6, message: 'Password must be at least 6 characters!' }
                                        ]}
                                    >
                                        <Input.Password placeholder="Enter password" size="large" className="form-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Contact Number"
                                        name="contactNumber"
                                        rules={[
                                            { required: true, message: 'Please input the contact number!' }
                                        ]}
                                    >
                                        <Input placeholder="Enter contact number" size="large" className="form-input" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Role"
                                        name="roles"
                                        rules={[{ required: true, message: 'Please select a role!' }]}
                                    >
                                        <Select placeholder="Select role" size="large" className="form-select">
                                            <Option value="ROLE_ADMIN">Admin</Option>
                                            <Option value="ROLE_EMPLOYEE">Employee</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item className="form-actions">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    size="large"
                                    className="submit-button"
                                >
                                    Add Employee
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => navigate('/admin/employee/manage')}
                                    className="cancel-button"
                                >
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddEmployee;
