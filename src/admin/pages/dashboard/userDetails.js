import React, { useState, useEffect, useCallback } from 'react';
import classes from './UserDetails.module.css';
import dashBoardDetailsService from '../../service/dashBoardDetailsService';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

function UserDetails() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await dashBoardDetailsService.getAllUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    console.log(users)

    // Apply search filter whenever searchTerm changes
    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();

        const filtered = users.filter(user =>
            Object.values(user).some(val =>
                String(val ?? '').toLowerCase().includes(term)
            )
        );

        setFilteredUsers(filtered);
    }, [searchTerm, users]);


    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort users based on sortConfig
    const sortedUsers = useCallback(() => {
        if (!sortConfig.key) return filteredUsers;

        return [...filteredUsers].sort((a, b) => {
            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredUsers, sortConfig]);

    // Refresh data
    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashBoardDetailsService.getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search handler
    const handleSearch = debounce((term) => {
        setSearchTerm(term);
    }, 300);

    // Data export functions
    const handleExportExcel = useCallback(() => {
        if (filteredUsers.length === 0) {
            alert('No user data available to export.');
            return;
        }

        try {
            const data = filteredUsers.map((user, index) => ({
                'S.No': index + 1,
                'ID': user.id,
                'Username': user.username,
                'Email': user.email,
                'Contact Number': user.contactNumber,
                'Roles': user.roles?.length ? user.roles.join(', ') : 'None',
                'Status': user.status || 'Active'
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'UserDetails');

            // Auto-size columns
            const wscols = [
                { wch: 8 },  // S.No
                { wch: 10 }, // ID
                { wch: 20 }, // Username
                { wch: 30 }, // Email
                { wch: 15 }, // Contact
                { wch: 25 }, // Roles
                { wch: 12 }  // Status
            ];
            ws['!cols'] = wscols;

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(file, `User_Details_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to generate Excel file. Please try again.');
        }
    }, [filteredUsers]);

    const handleExportPDF = useCallback(() => {
        if (filteredUsers.length === 0) {
            alert('No user data available to export.');
            return;
        }

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                compress: true
            });

            // Title and metadata
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(40, 40, 40);
            doc.text('User Details Report', 15, 15);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 22);
            doc.text(`Total Users: ${filteredUsers.length}`, 15, 27);

            // Prepare table data
            const tableData = filteredUsers.map((user, index) => [
                index + 1,
                user.id,
                user.username,
                user.email,
                user.contactNumber,
                user.roles?.length ? user.roles.join(', ') : 'None',
                user.status || 'Active'
            ]);

            // Generate table
            doc.autoTable({
                startY: 35,
                head: [['S.No', 'ID', 'Username', 'Email', 'Contact', 'Roles', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [51, 102, 153],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 10
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: 'linebreak',
                    valign: 'middle'
                },
                margin: { left: 15 },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    1: { cellWidth: 15, halign: 'center' },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 45 },
                    4: { cellWidth: 20, halign: 'center' },
                    5: { cellWidth: 30 },
                    6: { cellWidth: 15, halign: 'center' }
                },
                didDrawPage: (data) => {
                    // Footer
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(
                        `Page ${data.pageCount}`,
                        doc.internal.pageSize.width - 15,
                        doc.internal.pageSize.height - 10,
                        { align: 'right' }
                    );
                }
            });

            doc.save(`User_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF export failed:', err);
            setError('Failed to generate PDF. Please try again.');
        }
    }, [filteredUsers]);

    const handlePrint = useCallback(() => {
        if (filteredUsers.length === 0) {
            alert('No user data available to print.');
            return;
        }

        const printWindow = window.open('', '_blank');
        const printDate = new Date().toLocaleString();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>User Details Report</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @page { size: A4 landscape; margin: 10mm; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333;
                        background-color: #fff;
                    }
                    .print-header { 
                        margin-bottom: 20px; 
                        padding-bottom: 15px; 
                        border-bottom: 2px solid #eee;
                    }
                    .print-header h2 { 
                        color: #336699;
                        margin: 0 0 5px 0;
                        font-size: 24px;
                    }
                    .print-meta {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        color: #666;
                    }
                    .print-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 15px; 
                        font-size: 12px;
                        table-layout: fixed;
                    }
                    .print-table th { 
                        background-color: #336699;
                        color: white;
                        font-weight: 600;
                        text-align: left;
                        padding: 8px 10px;
                        position: sticky;
                        top: 0;
                    }
                    .print-table td { 
                        padding: 8px 10px;
                        border-bottom: 1px solid #eee;
                        word-wrap: break-word;
                    }
                    .print-table tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .print-table tr:hover {
                        background-color: #f1f1f1;
                    }
                    .print-footer {
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #eee;
                        font-size: 11px;
                        color: #777;
                        text-align: right;
                    }
                    @media print {
                        body { padding: 0; }
                        .print-table th { 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h2>User Details Report</h2>
                    <div class="print-meta">
                        <span><strong>Generated:</strong> ${printDate}</span>
                        <span><strong>Total Users:</strong> ${filteredUsers.length}</span>
                    </div>
                </div>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th width="5%">S.No</th>
                            <th width="10%">ID</th>
                            <th width="15%">Username</th>
                            <th width="25%">Email</th>
                            <th width="12%">Contact</th>
                            <th width="20%">Roles</th>
                            <th width="10%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedUsers().map((user, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td>${user.contactNumber || 'N/A'}</td>
                                <td>${user.roles?.length ? user.roles.join(', ') : 'None'}</td>
                                <td>${user.status || 'Active'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="print-footer">
                    Confidential - Internal Use Only
                </div>
                <script>
                    window.onload = () => {
                        setTimeout(() => { 
                            window.print(); 
                            window.close(); 
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }, [filteredUsers, sortedUsers]);

    // Render sort indicator
    const renderSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.titleGroup}>
                    <h1 className={classes.heading}>User Management</h1>
                    <p className={classes.subtitle}>View and manage all registered users</p>
                </div>

                <div className={classes.controls}>
                    <div className={classes.searchContainer}>
                        <FaSearch className={classes.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className={classes.searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <div className={classes.buttonGroup}>
                        <motion.button
                            className={`${classes.button} ${classes.refreshButton}`}
                            onClick={handleRefresh}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                        >
                            <FaSyncAlt className={`${classes.icon} ${loading ? classes.spin : ''}`} />
                            {window.innerWidth > 768 ? 'Refresh' : ''}
                        </motion.button>

                        <motion.button
                            className={`${classes.button} ${classes.excelButton}`}
                            onClick={handleExportExcel}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading || filteredUsers.length === 0}
                        >
                            <FaFileExcel className={classes.icon} />
                            {window.innerWidth > 768 ? 'Excel' : ''}
                        </motion.button>

                        <motion.button
                            className={`${classes.button} ${classes.pdfButton}`}
                            onClick={handleExportPDF}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading || filteredUsers.length === 0}
                        >
                            <FaFilePdf className={classes.icon} />
                            {window.innerWidth > 768 ? 'PDF' : ''}
                        </motion.button>

                        <motion.button
                            className={`${classes.button} ${classes.printButton}`}
                            onClick={handlePrint}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading || filteredUsers.length === 0}
                        >
                            <FaPrint className={classes.icon} />
                            {window.innerWidth > 768 ? 'Print' : ''}
                        </motion.button>
                    </div>
                </div>
            </div>

            {error && (
                <motion.div
                    className={classes.error}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <div className={classes.errorContent}>
                        <span>{error}</span>
                        <button
                            className={classes.dismissError}
                            onClick={() => setError(null)}
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}

            <div className={classes.tableContainer}>
                <AnimatePresence>
                    {loading ? (
                        <motion.div
                            className={classes.loading}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className={classes.spinner}></div>
                            <span>Loading user data...</span>
                            <div className={classes.loadingProgress}></div>
                        </motion.div>
                    ) : (
                        <>
                            {filteredUsers.length === 0 ? (
                                <motion.div
                                    className={classes.emptyState}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {searchTerm ? (
                                        <>
                                            <h3>No matching users found</h3>
                                            <p>Try adjusting your search criteria</p>
                                            <button
                                                className={classes.clearSearch}
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Clear search
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h3>No users available</h3>
                                            <p>The user list is currently empty</p>
                                        </>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.table
                                    className={classes.table}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <thead>
                                        <tr className={classes.headerRow}>
                                            <th
                                                className={`${classes.headerCell} ${classes.stickyColumn}`}
                                                onClick={() => requestSort('id')}
                                            >
                                                ID {renderSortIndicator('id')}
                                            </th>
                                            <th
                                                className={classes.headerCell}
                                                onClick={() => requestSort('username')}
                                            >
                                                Username {renderSortIndicator('username')}
                                            </th>
                                            <th
                                                className={classes.headerCell}
                                                onClick={() => requestSort('email')}
                                            >
                                                Email {renderSortIndicator('email')}
                                            </th>
                                            <th
                                                className={classes.headerCell}
                                                onClick={() => requestSort('contactNumber')}
                                            >
                                                Contact {renderSortIndicator('contactNumber')}
                                            </th>
                                            <th
                                                className={classes.headerCell}
                                                onClick={() => requestSort('roles')}
                                            >
                                                Roles {renderSortIndicator('roles')}
                                            </th>
                                            <th
                                                className={classes.headerCell}
                                                onClick={() => requestSort('status')}
                                            >
                                                Status {renderSortIndicator('status')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedUsers().map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                className={`${classes.dataRow} ${index % 2 === 0 ? classes.evenRow : ''}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                whileHover={{ backgroundColor: 'rgba(51, 102, 153, 0.05)' }}
                                            >
                                                <td className={`${classes.dataCell} ${classes.stickyColumn}`}>
                                                    {user.id}
                                                </td>
                                                <td className={classes.dataCell}>
                                                    <div className={classes.userCell}>
                                                        <span className={classes.username}>{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className={classes.dataCell}>
                                                    <a href={`mailto:${user.email}`} className={classes.emailLink}>
                                                        {user.email}
                                                    </a>
                                                </td>
                                                <td className={classes.dataCell}>
                                                    {user.contactNumber || 'N/A'}
                                                </td>
                                                <td className={classes.dataCell}>
                                                    <div className={classes.roles}>
                                                        {user.roles?.length ? (
                                                            user.roles.map((role, i) => (
                                                                <span key={i} className={classes.roleBadge}>
                                                                    {role}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className={classes.noRole}>None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={classes.dataCell}>
                                                    <span className={`${classes.statusBadge} ${user.status === 'Inactive' ? classes.inactive : classes.active
                                                        }`}>
                                                        {user.status || 'Active'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </motion.table>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {!loading && filteredUsers.length > 0 && (
                    <div className={classes.tableFooter}>
                        <div className={classes.footerInfo}>
                            Showing {filteredUsers.length} of {users.length} users
                            {searchTerm && ' (filtered)'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDetails;