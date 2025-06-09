import React, { useState, useMemo } from 'react';
import {
    Table, Button, Space, Modal, message, Card, Tag, Row, Col,
    Dropdown, Menu, Input, Tooltip, Badge
} from 'antd';
import {
    EditOutlined, DeleteOutlined, ExclamationCircleOutlined,
    FileExcelOutlined, FilePdfOutlined, PrinterOutlined,
    SearchOutlined, PlusOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useEmployees } from '../../../hooks/employee/useEmployees';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './EmployeeStyles.css';

const { confirm } = Modal;
const { Search } = Input;

const ManageEmployees = () => {
    const { employees, isLoading, refetch, deleteEmployee } = useEmployees();
    const [searchText, setSearchText] = useState('');

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp =>
            emp.username?.toLowerCase().includes(searchText.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            emp.contactNumber?.includes(searchText)
        );
    }, [searchText, employees]);

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this employee?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteEmployee(id);
            }
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredEmployees.map(emp => ({
                'Username': emp.username,
                'Email': emp.email,
                'Contact Number': emp.contactNumber,
                'Roles': emp.roles.join(', '),
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
            emp.roles.join(', '),
            emp.active ? 'Active' : 'Inactive'
        ]);

        doc.setFontSize(18);
        doc.setTextColor(40, 53, 147);
        doc.text('Employee Management Report', 14, 15);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            headStyles: {
                fillColor: [40, 53, 147],
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
            h1 { color: #283593; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #283593; color: white; padding: 8px; text-align: left; }
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
                  <td>${emp.roles.join(', ')}</td>
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
            width: '15%'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            width: '20%'
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            width: '15%'
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'status',
            render: (active) => (
                <Badge
                    status={active ? 'success' : 'error'}
                    text={active ? 'Active' : 'Inactive'}
                />
            ),
            width: '10%',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value, record) => record.active === value
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <Space size="small">
                    {roles.map((role) => (
                        <Tag
                            color={role === 'ROLE_ADMIN' ? 'volcano' : 'geekblue'}
                            key={role}
                        >
                            {role.replace('ROLE_', '')}
                        </Tag>
                    ))}
                </Space>
            ),
            width: '20%'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => console.log('Edit', record.id)}
                            className="action-btn"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                            className="action-btn"
                        />
                    </Tooltip>
                </Space>
            ),
            fixed: 'right',
            width: '10%'
        },
    ];

    const exportMenu = (
        <Menu>
            <Menu.Item key="excel" icon={<FileExcelOutlined />} onClick={exportToExcel}>
                Export to Excel
            </Menu.Item>
            <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={exportToPDF}>
                Export to PDF
            </Menu.Item>
            <Menu.Item key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
                Print
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="employee-container">
            <Card
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            <span className="card-title">Employee Management</span>
                        </Col>
                        <Col>
                            <span className="employee-count">
                                Total: {filteredEmployees.length} employee(s)
                            </span>
                        </Col>
                    </Row>
                }
                className="employee-card"
                bordered={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => window.location.href = '/employee/add'}
                        >
                            Add Employee
                        </Button>
                        <Dropdown overlay={exportMenu} placement="bottomRight">
                            <Button icon={<FileExcelOutlined />}>
                                Export
                            </Button>
                        </Dropdown>
                    </Space>
                }
            >
                <div className="table-header">
                    <Row justify="space-between" align="middle" gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Search employees..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                className="search-input"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} className="text-right">
                            <Space>
                                <Tooltip title="Refresh">
                                    <Button
                                        shape="circle"
                                        icon={<ReloadOutlined />}
                                        onClick={refetch}
                                        loading={isLoading}
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
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total) => `Total ${total} employees`
                    }}
                    scroll={{ x: '100%' }}
                    className="employee-table"
                    bordered
                />
            </Card>
        </div>
    );
};

export default ManageEmployees;
