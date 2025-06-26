import React, { useState, useRef } from 'react';
import { useOrderQueries } from '../../hooks/order/useOrderQueries';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    Box,
    Typography,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Grid,
    TableFooter,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Divider,
    Stack,
    
} from '@mui/material';
import {
    Print as PrintIcon,
    PictureAsPdf as PdfIcon,
    GridOn as ExcelIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Close as CloseIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    FirstPage,
    LastPage,
    Visibility as ViewIcon,
    
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Custom pagination actions component
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

// Helper function to get color based on order status
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'PROCESSING': return 'info';
        case 'SHIPPED': return 'primary';
        case 'DELIVERED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

const OrderPage = ({ orderType, title }) => {
    const {
        usePendingOrders,
        useShippedOrders,
        useDeliveredOrders,
        useCancelledOrders,
        useTotalRevenue,
        useTodayRevenue,
        useMonthlySalesReport
    } = useOrderQueries();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [exportType, setExportType] = useState('');
    const [exportMode, setExportMode] = useState('current');
    const tableRef = useRef();

    // Call all hooks unconditionally
    const pendingQuery = usePendingOrders(page, rowsPerPage);
    const shippedQuery = useShippedOrders(page, rowsPerPage);
    const deliveredQuery = useDeliveredOrders(page, rowsPerPage);
    const cancelledQuery = useCancelledOrders(page, rowsPerPage);
    const totalRevenueQuery = useTotalRevenue();
    const todayRevenueQuery = useTodayRevenue();
    const capitalizedOrderType = orderType ? orderType.charAt(0).toUpperCase() + orderType.slice(1) : '';
    const monthlySalesQuery = useMonthlySalesReport();

    // Select the appropriate query result based on orderType
    const queryResult = {
        pending: pendingQuery,
        shipped: shippedQuery,
        delivered: deliveredQuery,
        cancelled: cancelledQuery,
        totalRevenue: totalRevenueQuery,
        todayRevenue: todayRevenueQuery,
        monthlySales: monthlySalesQuery
    }[orderType];

    const { data, isLoading, error, refetch } = queryResult;

    // Normalize API data to match expected field names
    const normalizeOrder = (order) => ({
        order_id: order.orderId || order.id || 'N/A',
        user_name: order.customerName || order.user_name || 'N/A',
        contact: order.contact || 'N/A',
        email: order.email || 'N/A',
        total_amount: order.totalAmount || order.amount || 0,
        status: order.status || orderType.toUpperCase(),
        order_time: order.orderTime || order.date || 'N/A',
        orderItems: (order.orderItems || []).map(item => ({
            product_name: item.productName || item.product_name || 'N/A',
            quantity: item.quantity || 0,
            price: item.price || 0,
            sno: item.sno || 'N/A',
            tagno: item.tagno || 'N/A',
            item_id: item.itemid || 'N/A'
        }))
    });

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRefresh = () => {
        refetch();
    };

    // Filter orders based on search term
    const filteredOrders = orderType === 'monthlySales' ? data || []
        : (data?.[`${orderType}Orders`] || []).map(normalizeOrder).filter(order => {
            return (
                order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    // Modal handlers
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenViewModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedOrder(null);
    };

    // Export and Print handlers
    const handleOpenExportDialog = (type) => {
        setExportType(type);
        setOpenExportDialog(true);
    };

    const handleCloseExportDialog = () => {
        setOpenExportDialog(false);
        setExportType('');
        setExportMode('current');
    };

    const exportToPDF = (orders) => {
        const doc = new jsPDF({ orientation: "landscape" });
        const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).split("/").join("-");

        doc.setFontSize(14);
        doc.text(`${title} Report`, 14, 14);
        doc.setFontSize(10);
        doc.text(`Generated: ${timestamp} ${date}`, 14, 22);
        doc.text(`Total Records: ${orders.length}`, 14, 28);

        const headers = orderType === 'monthlySales'
            ? ['S.No', 'Month', 'Sales (₹)', 'Order Count']
            : ['S.No', 'Order ID', 'Customer', 'Phone',  'Amount', 'Status', 'Order Time', 'Items'];

        const tableData = orderType === 'monthlySales'
            ? orders.map((report, index) => [
                index + 1,
                report.month || `Month ${index + 1}`,
                parseFloat(report.sales)?.toFixed(2) || '0.00',
                report.orderCount || 0
            ])
            : orders.map((order, index) => [
                index + 1,
                order.order_id,
                order.user_name,
                order.contact,
                parseFloat(order.total_amount)?.toFixed(2) || '0.00',
                order.status,
                order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A',
                order.orderItems.map(item => `${item.product_name} ( ${parseFloat(item.price)?.toFixed(2)})`).join('; ')
            ]);

        autoTable(doc, {
            startY: 34,
            head: [headers],
            body: tableData,
            styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak", valign: "middle", halign: "left" },
            headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
            columnStyles: orderType === 'monthlySales'
                ? { 0: { cellWidth: 20 }, 1: { cellWidth: 60 }, 2: { cellWidth: 60, halign: "right" }, 3: { cellWidth: 60 } }
                : {
                    0: { cellWidth: 15 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 }, 3: { cellWidth: 25 }, 4: { cellWidth: 40 }, 5: { cellWidth: 25, halign: "right" }, 6: { cellWidth: 25 }, 7: { cellWidth: 40 }, 8: { cellWidth: 60 },
                    margin: { top: 34, left: 10, right: 10 }
                }});

        doc.save(`${orderType}_${date}.pdf`);
    };
    const exportToExcel = (orders) => {
        const header = orderType === 'monthlySales'
            ? ['S.No', 'Month', 'Sales (₹)', 'Order Count']
            : ['S.No', 'Order ID', 'Customer Name', 'Phone', 'Email', 'Amount (₹)', 'Status', 'Order Time', 'Items'];

        const tableData = orderType === 'monthlySales'
            ? orders.map((report, index) => [
                index + 1,
                report.month || `Month ${index + 1}`,
                parseFloat(report.sales)?.toFixed(2) || '0.00',
                report.orderCount || 0
            ])
            : orders.map((order, index) => [
                index + 1,
                order.order_id,
                order.user_name,
                order.contact,
                order.email,
                parseFloat(order.total_amount)?.toFixed(2) || '0.00',
                order.status,
                order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A',
                order.orderItems
                    .map(item => `${item.product_name} (Qty: ${item.quantity}, ₹${parseFloat(item.price)?.toFixed(2)}, TAG: ${item.tagno}, ID: ${item.item_id})`)
                    .join('; ')
            ]);

        const worksheetData = [header, ...tableData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Style header
        header.forEach((_, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
            worksheet[cellAddress] = {
                v: header[colIndex], s: {
                    fill: { fgColor: { rgb: '1976D2' } },
                    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                    alignment: { horizontal: 'center', vertical: 'center' },
                    border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
                }
            };
        });

        // Style body
        tableData.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
                worksheet[cellAddress] = {
                    v: cell, s: {
                        alignment: {
                            horizontal: orderType !== 'monthlySales' && colIndex === 5 ? 'right' : 'left',
                            vertical: 'top'
                        },
                        border: {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    }
                };
            });
        });

        // Set column widths
        worksheet['!cols'] = orderType === 'monthlySales'
            ? [{ wch: 8 }, { wch: 30 }, { wch: 20 }, { wch: 20 }]
            : [
                { wch: 8 },   // S.No
                { wch: 30 },  // Order ID
                { wch: 30 },  // Customer Name
                { wch: 20 },  // Phone
                { wch: 30 },  // Email
                { wch: 20 },  // Amount
                { wch: 20 },  // Status
                { wch: 30 },  // Order Time
                { wch: 60 }   // Items
            ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, title);
        XLSX.writeFile(workbook, `${orderType}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };
    

    const handlePrint = (orders) => {
        const printWindow = window.open('', '_blank');
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');

        printWindow.document.write(`
            <html>
            <head>
                <title>${title}</title>
                <style>
                    @page { size: A4 landscape; margin: 10mm; }
                    body { font-family: Arial, sans-serif; margin: 10px; font-size: 10px; color: #000; }
                    .print-header { margin-bottom: 12px; }
                    .print-title { font-size: 16px; font-weight: bold; margin-bottom: 6px; }
                    .print-meta { font-size: 10px; color: #555; margin: 2px 0; }
                    table { width: 100%; border-collapse: collapse; table-layout: fixed; word-break: break-word; }
                    th, td { border: 1px solid #ccc; padding: 6px 8px; vertical-align: top; }
                    th { background-color: #1976D2; color: white; font-weight: bold; text-align: center; font-size: 10px; }
                    td.amount { text-align: right; }
                    @media print { .no-print { display: none; } }
                    ${orderType === 'monthlySales'
                ? 'col.month { width: 40%; } col.sales { width: 30%; } col.count { width: 30%; }'
                : 'col.order-id { width: 15%; } col.customer { width: 15%; } col.phone { width: 10%; } col.email { width: 20%; } col.amount { width: 10%; } col.status { width: 10%; } col.time { width: 15%; } col.items { width: 25%; }'}
                </style>
            </head>
            <body>
                <div class="print-header">
                    <div class="print-title">${title} Report</div>
                    <div class="print-meta">Generated: ${time} ${date}</div>
                    <div class="print-meta">Total Records: ${orders.length}</div>
                </div>
                <table>
                    <colgroup>
                        ${orderType === 'monthlySales'
                ? '<col class="month" /><col class="sales" /><col class="count" />'
                : '<col class="order-id" /><col class="customer" /><col class="phone" /><col class="email" /><col class="amount" /><col class="status" /><col class="time" /><col class="items" />'}
                    </colgroup>
                    <thead>
                        <tr>
                            ${orderType === 'monthlySales'
                ? '<th>Month</th><th>Sales (₹)</th><th>Order Count</th>'
                : '<th>Order ID</th><th>Customer</th><th>Phone</th><th>Email</th><th>Amount (₹)</th><th>Status</th><th>Order Time</th><th>Items</th>'}
                        </tr>
                    </thead>
                    <tbody>
                        ${orderType === 'monthlySales'
                ? orders.map((report, index) => `
                                <tr>
                                    <td>${report.month || `Month ${index + 1}`}</td>
                                    <td class="amount">₹${parseFloat(report.sales)?.toFixed(2) || '0.00'}</td>
                                    <td>${report.orderCount || 0}</td>
                                </tr>
                            `).join('')
                : orders.map(order => `
                                <tr>
                                    <td>${order.order_id}</td>
                                    <td>${order.user_name}</td>
                                    <td>${order.contact}</td>
                                    <td>${order.email}</td>
                                    <td class="amount">₹${parseFloat(order.total_amount)?.toFixed(2) || '0.00'}</td>
                                    <td>${order.status}</td>
                                    <td>${order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A'}</td>
                                    <td>${order.orderItems.map(item => `${item.product_name} (Qty: ${item.quantity}, ₹${parseFloat(item.price)?.toFixed(2)})`).join('; ')}</td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    // Loading and error states
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Typography color="error">Error loading {title.toLowerCase()}: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {/* Title and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h1">{title}</Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to PDF">
                        <IconButton onClick={() => handleOpenExportDialog('pdf')} color="secondary">
                            <PdfIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to Excel">
                        <IconButton onClick={() => handleOpenExportDialog('excel')} color="success">
                            <ExcelIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                        <IconButton onClick={() => handleOpenExportDialog('print')}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 200, maxWidth: { xs: '100%', sm: 300 } }}
                />
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Table stickyHeader aria-label={`${orderType} table`} ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            {orderType === 'monthlySales'
                                ? <>
                                    <TableCell>Month</TableCell>
                                    <TableCell align="right">Sales (₹)</TableCell>
                                    <TableCell>Order Count</TableCell>
                                </>
                                : orderType === 'totalRevenue' || orderType === 'todayRevenue'
                                    ? <>
                                        <TableCell>Metric</TableCell>
                                        <TableCell align="right">Amount (₹)</TableCell>
                                    </>
                                    : <>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="right">Amount (₹)</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Order Date</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            orderType === 'monthlySales'
                                ? filteredOrders.map((report, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{report.month || `Month ${index + 1}`}</TableCell>
                                        <TableCell align="right">₹{parseFloat(report.sales)?.toFixed(2) || '0.00'}</TableCell>
                                        <TableCell>{report.orderCount || 0}</TableCell>
                                    </TableRow>
                                ))
                                : orderType === 'totalRevenue' || orderType === 'todayRevenue'
                                    ? <TableRow>
                                        <TableCell>{title}</TableCell>
                                        <TableCell align="right">₹{parseFloat(data?.[`${orderType.replace('use', '').toLowerCase()}`])?.toFixed(2) || '0.00'}</TableCell>
                                    </TableRow>
                                    : filteredOrders.map(order => (
                                        <TableRow key={order.order_id} hover>
                                            <TableCell>{order.order_id}</TableCell>
                                            <TableCell>{order.user_name}</TableCell>
                                            <TableCell>{order.email}</TableCell>
                                            <TableCell align="right">₹{parseFloat(order.total_amount)?.toFixed(2) || '0.00'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A'}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="View Order">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewOrder(order)}
                                                            color="primary"
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={orderType === 'monthlySales' ? 3 : orderType === 'totalRevenue' || orderType === 'todayRevenue' ? 2 : 7} align="center">
                                    No {orderType === 'monthlySales' ? 'sales data' : 'orders'} found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {!(orderType === 'totalRevenue' || orderType === 'todayRevenue') && (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    colSpan={orderType === 'monthlySales' ? 3 : 7}
                                    count={data?.[`total${orderType.charAt(0).toUpperCase() + orderType.slice(1)}`] || data?.total || filteredOrders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>

            {/* Export/Print Selection Dialog */}
            <Dialog open={openExportDialog} onClose={handleCloseExportDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Select Export/Print Option</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={exportMode}
                            onChange={(e) => setExportMode(e.target.value)}
                        >
                            <FormControlLabel
                                value="current"
                                control={<Radio />}
                                label={`Current View (${filteredOrders.length} ${orderType === 'monthlySales' ? 'records' : 'orders'})`}
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExportDialog}>Cancel</Button>
                    <Button
                        onClick={() => {
                            switch (exportType) {
                                case 'pdf': exportToPDF(filteredOrders); break;
                                case 'excel': exportToExcel(filteredOrders); break;
                                case 'print': handlePrint(filteredOrders); break;
                                default: break;
                            }
                            handleCloseExportDialog();
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Order Modal */}
            <OrderViewModal
                open={openViewModal}
                onClose={handleCloseViewModal}
                order={selectedOrder}
                orderType={orderType}
            />
        </Box>
    );
};

// View Order Modal Component
const OrderViewModal = ({ open, onClose, order, orderType }) => {
    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Order Details - {order.order_id || 'N/A'}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Customer Information</Typography>
                        <Divider />
                        <Box mt={1}>
                            <Typography><strong>Name:</strong> {order.user_name || 'N/A'}</Typography>
                            <Typography><strong>Contact:</strong> {order.contact || 'N/A'}</Typography>
                            <Typography><strong>Email:</strong> {order.email || 'N/A'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Order Details</Typography>
                        <Divider />
                        <Box mt={1}>
                            <Typography>
                                <strong>Order Date:</strong> {order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                <strong>Status:</strong>
                                <Chip
                                    label={order.status || orderType.toUpperCase()}
                                    color={getStatusColor(order.status || orderType.toUpperCase())}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                            <Typography><strong>Amount:</strong> ₹{parseFloat(order.total_amount)?.toFixed(2) || '0.00'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>Order Items</Typography>
                        <Divider />
                        <TableContainer component={Paper} sx={{ mt: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Price (₹)</TableCell>
                                        <TableCell>SNO</TableCell>
                                        <TableCell>SK-Unit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderItems?.length > 0 ? (
                                        order.orderItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.product_name || 'N/A'}</TableCell>
                                                <TableCell align="right">₹{parseFloat(item.price)?.toFixed(2) || '0.00'}</TableCell>
                                                <TableCell>{item.sno || 'N/A'}</TableCell>
                                                <TableCell>{item.item_id} - {item.tagno} </TableCell>
                                                
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5}>No items found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

// Individual page components for each order type
export const PendingOrdersPage = () => <OrderPage orderType="pending" title="Pending Orders" />;
export const ShippedOrdersPage = () => <OrderPage orderType="shipped" title="Shipped Orders" />;
export const DeliveredOrdersPage = () => <OrderPage orderType="delivered" title="Delivered Orders" />;
export const CancelledOrdersPage = () => <OrderPage orderType="cancelled" title="Cancelled Orders" />;
export const TotalRevenuePage = () => <OrderPage orderType="totalRevenue" title="Total Revenue" />;
export const TodayRevenuePage = () => <OrderPage orderType="todayRevenue" title="Today's Revenue" />;
export const MonthlySalesPage = () => <OrderPage orderType="monthlySales" title="Monthly Sales Report" />;