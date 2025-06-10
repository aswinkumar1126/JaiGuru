import React, { useState, useEffect, useCallback } from 'react';
import classes from './UserDetails.module.css';
import dashBoardDetailsService from '../../service/dashBoardDetailsService';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function UserDetails() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await dashBoardDetailsService.getAllUsers();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Data export functions
    const handleExportExcel = useCallback(() => {
        if (users.length === 0) return alert('No user data available to export.');
        try {
            const data = users.map((user, index) => ({
                'S.No': index + 1,
                'ID': user.id,
                'Username': user.username,
                'Email': user.email,
                'Contact Number': user.contactNumber,
                'Roles': user.roles?.length ? user.roles.join(', ') : 'None',
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'UserDetails');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `User_Details_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to generate Excel file. Please try again.');
        }
    }, [users]);

    const handleExportPDF = useCallback(() => {
        if (users.length === 0) return alert('No user data available to export.');
        try {
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('User Details Report', 15, 15);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 22);
            const tableData = users.map((user, index) => [
                index + 1,
                user.id,
                user.username,
                user.email,
                user.contactNumber,
                user.roles?.length ? user.roles.join(', ') : 'None',
            ]);
            doc.autoTable({
                startY: 30,
                head: [['S.No', 'ID', 'Username', 'Email', 'Contact Number', 'Roles']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
                margin: { left: 15 },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 15 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 60 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 40 }
                },
            });
            doc.save(`User_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF export failed:', err);
            setError('Failed to generate PDF. Please try again.');
        }
    }, [users]);

    const handlePrint = useCallback(() => {
        if (users.length === 0) return alert('No user data available to print.');
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>User Details Report</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; margin: 20mm; color: #333; }
                    .print-header { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                    .print-header h2 { color: #2c3e50; margin-bottom: 5px; }
                    .print-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                    .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .print-table th { background-color: #f5f5f5; font-weight: bold; }
                    @page { size: A4 landscape; margin: 20mm; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h2>User Details Report</h2>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(
            (user, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.email}</td>
                                    <td>${user.contactNumber}</td>
                                    <td>${user.roles?.length ? user.roles.join(', ') : 'None'}</td>
                                </tr>
                            `
        ).join('')}
                    </tbody>
                </table>
                <script>
                    window.onload = () => setTimeout(() => { window.print(); window.close(); }, 200);
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }, [users]);

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <h1 className={classes.heading}>All User Details</h1>
                <div className={classes.buttonGroup}>
                    <motion.button
                        className={classes.button}
                        onClick={handleExportExcel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaFileExcel className={classes.icon} /> Export to Excel
                    </motion.button>
                    <motion.button
                        className={classes.button}
                        onClick={handleExportPDF}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaFilePdf className={classes.icon} /> Export to PDF
                    </motion.button>
                    <motion.button
                        className={classes.button}
                        onClick={handlePrint}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPrint className={classes.icon} /> Print
                    </motion.button>
                </div>
            </div>
            {error && <p className={classes.error}>Error: {error}</p>}
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
                            Loading...
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
                                    <th className={classes.headerCell}>ID</th>
                                    <th className={classes.headerCell}>Username</th>
                                    <th className={classes.headerCell}>Email</th>
                                    <th className={classes.headerCell}>Contact Number</th>
                                    <th className={classes.headerCell}>Roles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            className={`${classes.dataRow} ${index % 2 === 0 ? classes.evenRow : ''}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                        >
                                            <td className={classes.dataCell}>{user.id}</td>
                                            <td className={classes.dataCell}>{user.username}</td>
                                            <td className={classes.dataCell}>{user.email}</td>
                                            <td className={classes.dataCell}>{user.contactNumber}</td>
                                            <td className={classes.dataCell}>
                                                {user.roles?.length ? user.roles.join(', ') : 'None'}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={classes.noDataCell}>
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </motion.table>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default UserDetails;