import React, { useState, useMemo } from 'react';
import {
    Table, Button, Space, Modal, message, Card, Tag, Row, Col,
    Dropdown, Input, Tooltip, Badge
} from 'antd';
import {
    EditOutlined, DeleteOutlined, ExclamationCircleOutlined,
    FileExcelOutlined, FilePdfOutlined, PrinterOutlined,
    SearchOutlined, PlusOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../hooks/employee/useEmployees';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './EmployeeStyles.css';

const { confirm } = Modal;
const { Search } = Input;

const ManageEmployees = () => {
    const navigate = useNavigate();
    const { employees, isLoading, refetch, deleteEmployee } = useEmployees();
    const [searchText, setSearchText] = useState('');

    const filteredEmployees = useMemo(() => {
        return employees
            .filter(emp =>
                emp.roles?.some(role =>
                    ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role)
                )
            )
            .filter(emp =>
                emp.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.contactNumber?.includes(searchText)
            );
    }, [searchText, employees]);
    

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this employee?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteEmployee(id);
                message.success('Employee deleted successfully!');
            },
            onError() {
                message.error('Failed to delete employee.');
            }
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredEmployees.map(emp => ({
                'Username': emp.username,
                'Email': emp.email,
                'Contact Number': emp.contactNumber,
                'Roles': emp.roles
                    .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                    .map(role => role.replace('ROLE_', ''))
                    .join(', '),
                'Status': emp.active ? 'Active' : 'Inactive'
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

        worksheet['!cols'] = [
            { wch: 20 },
            { wch: 30 },
            { wch: 15 },
            { wch: 20 },
            { wch: 10 }
        ];

        XLSX.writeFile(workbook, `employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
        message.success('Excel exported successfully!');
    };
    

const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Username', 'Email', 'Contact', 'Roles', 'Status'];
    const tableRows = filteredEmployees.map(emp => [
        emp.username,
        emp.email,
        emp.contactNumber,
        emp.roles
            .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
            .map((role => role.replace('ROLE_', '')))
            .join(', '),
        emp.active ? 'Active' : 'Inactive'
    ]);

    doc.setFontSize(18);
    doc.setTextColor(255, 98, 0);
    doc.text('Employee Management Report', 14, 15);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        headStyles: {
            fillColor: [255, 98, 0],
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { fontSize: 10, cellPadding: 3 },
        margin: { top: 30 }
    });

    doc.save(`employees_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success('PDF exported successfully!');
};

const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
            <html>
                <head>
                    <title>Employee List</title>
                    <style>
                        body { font-family: Arial; margin: 20px; }
                        h1 { color: #ff6200; }
                        p { color: #666; }
                        table { width: 100%; border-collapse: collapse; }
                        th { background-color: #ff6200; color: white; padding: 8px; text-align: left; }
                        td { padding: 8px; border-bottom: 1px solid #ddd; }
                        tr:nth-child(even) { background-color: #f5f5f5; }
                        .print-footer { margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>Employee List</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Roles</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredEmployees.map(emp => `
                                <tr>
                                    <td>${emp.username}</td>
                                    <td>${emp.email}</td>
                                    <td>${emp.contactNumber}</td>
                                    <td>${emp.roles
            .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
            .map((role => role.replace('ROLE_', '')))
            .join(', ')}</td>
                                    <td>${emp.active ? 'Active' : 'Inactive'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="print-footer">
                        Total Employees: ${filteredEmployees.length}
                    </div>
                </body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();
};

const columns = [
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username.localeCompare(b.username),
        responsive: ['xs'],
        width: 150,
        render: (text) => <span data-label="Username">{text}</span>
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        responsive: ['sm'],
        width: 200,
        render: (text) => <span data-label="Email">{text}</span>
    },
    {
        title: 'Contact',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        responsive: ['sm'],
        width: 120,
        render: (text) => <span data-label="Contact">{text}</span>
    },
    {
        title: 'Status',
        dataIndex: 'active',
        key: 'status',
        render: (active) => (
            <Badge
                status={active ? 'success' : 'error'}
                text={<span data-label="Status">{active ? 'Active' : 'Inactive'}</span>}
            />
        ),
        responsive: ['xs'],
        width: 100,
        filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false }
        ],
        onFilter: (value, record) => record.active === value,
    },
    {
        title: 'Roles',
        dataIndex: 'roles',
        key: 'roles',
        render: (roles) => (
            <Space size="small" wrap data-label="Roles">
                {roles
                    .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                    .map((role) => (
                        <Tag
                            color={role === 'ROLE_ADMIN' ? 'volcano' : 'geekblue'}
                            key={role}
                        >
                            {role.replace('ROLE_', '')}
                        </Tag>
                    ))}
            </Space>
        ),
        responsive: ['md'],
        width: 150,
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space size="small" data-label="Actions">
                <Tooltip title="Edit">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/employees/edit/${record.id}`)}
                        className="action-btn"
                    />
                </Tooltip>
                <Tooltip title="Delete">
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        className="action-btn action-btn-danger"
                    />
                </Tooltip>
            </Space>
        ),
        fixed: 'right',
        width: 100,
    },
];

const exportMenuItems = [
    {
        key: 'excel',
        icon: <FileExcelOutlined />,
        label: 'Export to Excel',
        onClick: exportToExcel,
    },
    {
        key: 'pdf',
        icon: <FilePdfOutlined />,
        label: 'Export to PDF',
        onClick: exportToPDF,
    },
    {
        key: 'print',
        icon: <PrinterOutlined />,
        label: 'Print',
        onClick: handlePrint,
    },
];

return (
    <div className="employee-wrapper">
        <Card
            title={
                <Row justify="space-between" align="middle">
                    <Col>
                        <span className="card-title">Manage Employees</span>
                        <span className="employee-count">
                            ({filteredEmployees.length} employees)
                        </span>
                    </Col>
                </Row>
            }
            className="employee-card"
            bordered={false}
            extra={
                <div className="card-actions">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/employees/add')}
                        size="middle"
                    >
                        Add
                    </Button>
                    <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                        <Button icon={<FileExcelOutlined />} size="middle">
                            Export
                        </Button>
                    </Dropdown>
                </div>
            }
        >
            <div className="table-header">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search by username, email, or contact..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            className="search-bar"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={16} className="table-actions-align">
                        <Space>
                            <Tooltip title="Refresh">
                                <Button
                                    shape="circle"
                                    icon={<ReloadOutlined />}
                                    onClick={refetch}
                                    loading={isLoading}
                                    size="middle"
                                />
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Table
                columns={columns}
                dataSource={filteredEmployees}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '50'],
                    showTotal: (total) => `Total ${total} employees`
                }}
                scroll={{ x: 'max-content' }}
                className="employee-table"
                bordered
            />
        </Card>
    </div>
);
};

export default ManageEmployees;