import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../hooks/employee/useEmployees';
import * as XLSX from 'sheetjs-style';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './EmployeeStyles.css';

const ManageEmployees = () => {
    const navigate = useNavigate();
    const { employees, isLoading, refetch, deleteEmployee, isDeleting } = useEmployees();
    const [searchText, setSearchText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const filteredEmployees = useMemo(() => {
        return employees
            .filter(emp =>
                emp.roles?.some(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
            )
            .filter(emp =>
                emp.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.contactNumber?.includes(searchText)
            );
    }, [searchText, employees]);

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteEmployee(deleteId, {
            onSuccess: () => {
                setToastMessage('Employee deleted successfully!');
                setToastVariant('success');
                setShowToast(true);
                setShowDeleteModal(false);
            },
            onError: (error) => {
                console.error('Delete error:', error);
                setToastMessage('Failed to delete employee.');
                setToastVariant('danger');
                setShowToast(true);
                setShowDeleteModal(false);
            },
        });
    };
    const exportToExcel = () => {
        const data = filteredEmployees.map(emp => ({
            Username: emp.username,
            Email: emp.email,
            'Contact Number': emp.contactNumber,
            Roles: emp.roles
                .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                .map(role => role.replace('ROLE_', ''))
                .join(', '),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 },
            { wch: 30 },
            { wch: 15 },
            { wch: 20 },
            { wch: 10 },
        ];

        // Style header row (assumes 5 columns)
        const headerStyle = {
            fill: { fgColor: { rgb: 'D3D3D3' } }, // Light gray
            font: { bold: true, color: { rgb: '000000' } },
            alignment: { horizontal: 'center' },
        };

        const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1'];
        headerCells.forEach(cell => {
            if (worksheet[cell]) {
                worksheet[cell].s = headerStyle;
            }
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

        XLSX.writeFile(workbook, `employees_${new Date().toISOString().slice(0, 10)}.xlsx`);

        setToastMessage('Excel exported successfully!');
        setToastVariant('success');
        setShowToast(true);
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
                .map(role => role.replace('ROLE_', ''))
                .join(', '),
            emp.active ? 'Active' : 'Inactive',
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
                fontStyle: 'bold',
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { top: 30 },
        });

        doc.save(`employees_report_${new Date().toISOString().slice(0, 10)}.pdf`);
        setToastMessage('PDF exported successfully!');
        setToastVariant('success');
        setShowToast(true);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <html>
          <head>
            <title>Employee List</title>
            <style>
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 40px;
                color: #333;
              }
              h1 {
                color: #ff6200;
                margin-bottom: 5px;
              }
              p {
                color: #555;
                font-size: 14px;
                margin-top: 0;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                font-size: 14px;
              }
              th {
                background-color: #ff6200;
                color: white;
                padding: 10px;
                text-align: left;
                border-bottom: 2px solid #e0e0e0;
              }
              td {
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
              }
              tr:nth-child(even) {
                background-color: #fafafa;
              }
              .print-footer {
                font-size: 12px;
                color: #777;
                border-top: 1px solid #ccc;
                padding-top: 10px;
                text-align: right;
              }
              @media print {
                body {
                  margin: 10mm;
                }
                h1, p {
                  page-break-inside: avoid;
                }
                table {
                  page-break-inside: auto;
                }
                tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
                }
              }
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
                </tr>
              </thead>
              <tbody>
                ${filteredEmployees
                .map(emp => `
                    <tr>
                      <td>${emp.username}</td>
                      <td>${emp.email}</td>
                      <td>${emp.contactNumber}</td>
                      <td>${emp.roles
                        .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                        .map(role => role.replace('ROLE_', ''))
                        .join(', ')}</td>
                     
                    </tr>
                `)
                .join('')}
              </tbody>
            </table>
            <div class="print-footer">
              Total Employees: ${filteredEmployees.length}
            </div>
          </body>
        </html>
      `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    
   
    return (
        <div className="employee-management-container">
            <div className={`toast-notification ${toastVariant} ${showToast ? 'show' : ''}`}>
                <div className="toast-header">
                    <strong>{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
                    <button onClick={() => setShowToast(false)}>×</button>
                </div>
                <div className="toast-body">{toastMessage}</div>
            </div>

            <div className="employee-card">
                <div className="card-header">
                    <div className="header-content">
                        <h2>Manage Employees <span>({filteredEmployees.length} employees)</span></h2>
                        <div className="header-actions">
                            <button className="btn-primary" onClick={() => navigate('/employees/add')}>
                                <span>+</span> Add
                            </button>
                            <div className="dropdown">
                                <button className="btn-outline">
                                    <span>↓</span> Export
                                </button>
                                <div className="dropdown-menu">
                                    <button onClick={exportToExcel}> Excel</button>
                                    <button onClick={exportToPDF}>PDF</button>
                                    <button onClick={handlePrint}>Print</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by username, email, or contact..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <button className="search-btn">
                            <span>🔍</span>
                        </button>
                    </div>

                    <button className="refresh-btn" onClick={refetch} disabled={isLoading}>
                        <span className={isLoading ? 'spin' : ''}>↻</span> Refresh
                    </button>

                    {/* Desktop Table */}
                    <div className="desktop-view">
                        <table className="employee-table">
                            <thead className='employee-table-head'>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Mobile Number</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map(emp => (
                                    <tr key={emp.id}>
                                        <td>
                                            <div className="user-info">
                                                <strong>{emp.username}</strong>
                                              
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <small>{emp.email}</small>

                                            </div> 
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <small>{emp.contactNumber}</small>
                                                
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <small>{emp.roles
                                                    .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                                                    .map(role => (
                                                        <span key={role} className={`role-badge ${role === 'ROLE_ADMIN' ? 'admin' : 'employee'}`}>
                                                            {role.replace('ROLE_', '')}
                                                        </span>
                                                    ))}</small>

                                            </div>
                                        </td>
                                      
                                        <td>
                                            <div className="action-buttons">
                                                {/* <button className="btn-edit" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                                                    Edit
                                                </button> */}
                                                <button className="btn-delete" onClick={() => handleDelete(emp.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="mobile-view">
                        {filteredEmployees.map(emp => (
                            <div key={emp.id} className="employee-mobile-card">
                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>{emp.username}</h3>
                                      
                                    </div>

                                    <div className="info-row">
                                        <label>Email:</label>
                                        <span>{emp.email}</span>
                                    </div>

                                    <div className="info-row">
                                        <label>Contact:</label>
                                        <span>{emp.contactNumber}</span>
                                    </div>

                                    <div className="info-row">
                                        <label>Roles:</label>
                                        <div className="role-badges">
                                            {emp.roles
                                                .filter(role => ['ROLE_EMPLOYEE', 'ROLE_ADMIN'].includes(role))
                                                .map(role => (
                                                    <span key={role} className={`role-badge ${role === 'ROLE_ADMIN' ? 'admin' : 'employee'}`}>
                                                        {role.replace('ROLE_', '')}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                                            Edit
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(emp.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this employee?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-confirm" onClick={confirmDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
   

export default ManageEmployees;