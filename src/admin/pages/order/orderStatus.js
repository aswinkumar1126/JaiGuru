import React, { useState, useRef, useEffect } from 'react';
import { useAllOrders, useUpdateOrderStatus } from '../../hooks/order/useAllOrder';
import { orderService } from '../../service/orderService';
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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Typography,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Chip,
    Grid,
    TableFooter,
    Alert,
    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    Collapse,
    Avatar
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
    Edit as EditIcon,
    Visibility as ViewIcon,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './OrderManagement.css';

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

const OrderStatusManagement = () => {
    // State management
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [exportType, setExportType] = useState('');
    const [exportMode, setExportMode] = useState('current');
    const [isFetchingFullList, setIsFetchingFullList] = useState(false);
    const [fullOrderList, setFullOrderList] = useState([]);
    const [editForm, setEditForm] = useState({
        status: '',
        remarks: '',
        paymentMode: '',
    });
    const [formError, setFormError] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const tableRef = useRef();

    // API hooks
    const { data, isLoading, isError, error, refetch } = useAllOrders(page, rowsPerPage);
    const updateOrderStatus = useUpdateOrderStatus();

    // Normalize order data with fallback values
    const normalizeOrder = (order = {}) => ({
        id: order.id || 'N/A',
        order_id: order.order_id || order.orderId || 'N/A',
        user_name: order.user_name || order.customerName || 'N/A',
        contact: order.contact || 'N/A',
        email: order.email || 'N/A',
        total_amount: parseFloat(order.total_amount || order.totalAmount || order.amount || 0),
        status: order.status || 'PENDING',
        order_time: order.order_time || order.orderTime || order.date || 'N/A',
        payment_mode: order.payment_mode || 'N/A',
        address: order.address || 'N/A',
        orderItems: (order.orderItems || []).map(item => ({
            product_name: item.product_name || item.productName || 'N/A',
            quantity: item.quantity || 0,
            price: parseFloat(item.price || 0),
            sno: item.sno || 'N/A',
            tagno: item.tagno || 'N/A',
            item_id: item.item_id || item.itemid || 'N/A',
            image_path: item.image_path || item.imagePath || null
        }))
    });

    // Get normalized orders from API data
    const orders = React.useMemo(() => {
        return (data?.data?.orders || []).map(normalizeOrder);
    }, [data]);

    // Toggle row expansion
    const toggleRowExpansion = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Fetch full order list using the hook
    const fetchFullOrderList = async () => {
        setIsFetchingFullList(true);
        try {
            const totalOrders = data?.data?.totalOrders || 1000;
            const response = await orderService.getAllOrders(0, totalOrders);
            const normalizedOrders = (response?.data?.orders || []).map(normalizeOrder);
            setFullOrderList(normalizedOrders);
            return normalizedOrders;
        } catch (err) {
            console.error("Error fetching full order list:", err);
            return [];
        } finally {
            setIsFetchingFullList(false);
        }
    };

    // Event handlers
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

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    // Filter orders based on search term and status filter
    const filteredOrders = React.useMemo(() => {
        return orders.filter(order => {
            const searchTermLower = (searchTerm || '').toLowerCase();
            const orderId = (order.order_id || '').toLowerCase();
            const userName = (order.user_name || '').toLowerCase();
            const contact = (order.contact || '').toLowerCase();
            const email = (order.email || '').toLowerCase();
            const status = order.status || '';

            const matchesSearch =
                orderId.includes(searchTermLower) ||
                userName.includes(searchTermLower) ||
                contact.includes(searchTermLower) ||
                email.includes(searchTermLower);

            const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    // Modal handlers
    const handleViewOrder = (order) => {
        setSelectedOrder(normalizeOrder(order));
        setOpenViewModal(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(normalizeOrder(order));
        setEditForm({
            status: order.status,
            remarks: '',
            paymentMode: order.payment_mode || 'ONLINE',
        });
        setOpenEditModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedOrder(null);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedOrder(null);
        setEditForm({ status: '', remarks: '', paymentMode: '' });
        setFormError('');
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        if (!editForm.status || !editForm.paymentMode) {
            setFormError('Status and Payment Mode are required.');
            return;
        }

        const payload = {
            orderId: selectedOrder.order_id,
            status: editForm.status,
            remarks: editForm.remarks,
            paymentMode: editForm.paymentMode,
            paymentStatus: 'UNKNOWN',
        };

        try {
            await updateOrderStatus.mutateAsync(payload);
            refetch();
            handleCloseEditModal();
        } catch (err) {
            setFormError(`Failed to update order: ${err.message || 'Unknown error'}`);
        }
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

    const handleExportConfirm = async () => {
        let ordersToExport = filteredOrders;

        if (exportMode === 'full') {
            const fullData = await fetchFullOrderList();
            if (!fullData || fullData.length === 0) {
                alert("Failed to fetch full order list");
                return;
            }
            ordersToExport = fullData;
        }

        switch (exportType) {
            case 'pdf':
                exportToPDF(ordersToExport);
                break;
            case 'excel':
                exportToExcel(ordersToExport);
                break;
            case 'print':
                handlePrint(ordersToExport);
                break;
            default:
                break;
        }

        handleCloseExportDialog();
    };

    const exportToPDF = (orders) => {
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const date = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).split("/").join("-");

        // Header
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Order Management Report", 14, 14);
        doc.setFontSize(10);
        doc.text(`Generated: ${timestamp} ${date}`, 14, 22);
        doc.text(`Total Orders: ${orders.length}`, 14, 28);

        const mainHeaders = [
            "S.No", "Order ID", "Customer", "Phone", "Amount", "Status", "Order Time", "Payment", "Items"
        ];

        const mainData = orders.map((order, index) => {
            const itemsFormatted = (order.orderItems || []).map(item =>
                `• ${item.product_name}\n  SKU: ${item.item_id}-${item.tagno}, ₹${parseFloat(item.price).toFixed(2)}`
            ).join('\n\n');

            return [
                index + 1,
                order.order_id || "N/A",
                order.user_name || "N/A",
                order.contact || "N/A",
                parseFloat(order.total_amount)?.toFixed(2) || "0.00",
                order.status || "N/A",
                order.order_time ? new Date(order.order_time).toLocaleString() : "N/A",
                order.payment_mode || "N/A",
                itemsFormatted?.trim().length ? itemsFormatted : "No items available"
            ];
        });

        autoTable(doc, {
            startY: 34,
            head: [mainHeaders],
            body: mainData,
            styles: {
                fontSize: 8,
                cellPadding: 1.5,
                overflow: "linebreak",
                valign: "top",
                halign: "left",
                minCellHeight: 10
            },
            headStyles: {
                fillColor: [25, 118, 210],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center"
            },
            columnStyles: {
                0: { cellWidth: 12 },
                1: { cellWidth: 30 },
                2: { cellWidth: 28 },
                3: { cellWidth: 26 },
                4: { cellWidth: 20 },
                5: { cellWidth: 24 },
                6: { cellWidth: 36 },
                7: { cellWidth: 25 },
                8: { cellWidth: 75 }, // Items
            },
            pageBreak: 'auto',
            margin: { top: 34, left: 10, right: 10 },
            didDrawPage: (data) => {
                doc.setFontSize(8);
                const pageHeight = doc.internal.pageSize.height;
                doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, pageHeight - 5);
            }
        });

        doc.save(`orders_${date}.pdf`);
    };

    const exportToExcel = (orders) => {
        const workbook = XLSX.utils.book_new();

        // Create main orders sheet
        const orderHeader = [
            'S.No',
            'Order ID',
            'Customer Name',
            'Phone',
            'Email',
            'Address',
            'Amount (₹)',
            'Status',
            'Order Time',
            'Payment Mode',
            'Product Count'
        ];

        const orderData = orders.map((order, index) => [
            index + 1,
            order.order_id || 'N/A',
            order.user_name || 'N/A',
            order.contact || 'N/A',
            order.email || 'N/A',
            order.address || 'N/A',
            parseFloat(order.total_amount)?.toFixed(2) || '0.00',
            order.status || 'N/A',
            order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A',
            order.payment_mode || 'N/A',
            order.orderItems?.length || 0
        ]);

        const orderSheet = XLSX.utils.aoa_to_sheet([orderHeader, ...orderData]);
        XLSX.utils.book_append_sheet(workbook, orderSheet, 'Orders');

        // Create products sheet if there are any products
        const hasProducts = orders.some(order => order.orderItems && order.orderItems.length > 0);
        if (hasProducts) {
            const productHeader = [
                'Order ID',
                'Product Name',
                'Tag No',
                'S.No',
                'Quantity',
                'Price',
                'Total'
            ];

            const productData = [];
            orders.forEach(order => {
                if (order.orderItems && order.orderItems.length > 0) {
                    order.orderItems.forEach(item => {
                        productData.push([
                            order.order_id || 'N/A',
                            item.product_name || 'N/A',
                            item.tagno || 'N/A',
                            item.sno || 'N/A',
                            item.quantity || 0,
                            parseFloat(item.price)?.toFixed(2) || '0.00',
                            (item.quantity * parseFloat(item.price))?.toFixed(2) || '0.00'
                        ]);
                    });
                }
            });

            const productSheet = XLSX.utils.aoa_to_sheet([productHeader, ...productData]);
            XLSX.utils.book_append_sheet(workbook, productSheet, 'Products');
        }

        // Apply styles
        const ws = workbook.Sheets['Orders'];

        // Style header
        const headerRange = XLSX.utils.decode_range(ws['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            ws[cellAddress].s = {
                fill: { fgColor: { rgb: '1976D2' } },
                font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } },
                },
            };
        }

        // Set column widths
        ws['!cols'] = [
            { wch: 8 },   // S.No
            { wch: 22 },   // Order ID
            { wch: 28 },   // Customer Name
            { wch: 22 },   // Phone
            { wch: 35 },   // Email
            { wch: 60 },   // Address
            { wch: 18 },   // Amount
            { wch: 18 },   // Status
            { wch: 28 },   // Order Time
            { wch: 22 },   // Payment Mode
            { wch: 15 }    // Product Count
        ];

        // Save the file
        XLSX.writeFile(workbook, `orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handlePrint = (orders) => {
        const printWindow = window.open('', '_blank');
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');

        printWindow.document.write(`
        <html>
        <head>
            <title>Order Report</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 10px;
                    font-size: 10px;
                    color: #000;
                }
                .print-header {
                    margin-bottom: 12px;
                }
                .print-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 6px;
                }
                .print-meta {
                    font-size: 10px;
                    color: #555;
                    margin: 2px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    word-break: break-word;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 6px 8px;
                    vertical-align: top;
                }
                th {
                    background-color: #1976D2;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    font-size: 10px;
                }
                td.amount {
                    text-align: right;
                    white-space: nowrap;
                }
                td.address {
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                td.order-id {
                    word-break: break-word;
                }
                .product-table {
                    margin-top: 10px;
                    margin-bottom: 20px;
                }
                .product-header {
                    font-weight: bold;
                    margin-top: 10px;
                }
                @media print {
                    .no-print { display: none; }
                }
                col.order-id { width: 18%; }
                col.customer { width: 15%; }
                col.phone { width: 14%; }
                col.address { width: 25%; }
                col.amount { width: 10%; }
                col.status { width: 14%; }
                col.time { width: 18%; }
                col.payment { width: 12%; }
            </style>
        </head>
        <body>
            <div class="print-header">
                <div class="print-title">Order Management Report</div>
                <div class="print-meta">Generated: ${time} ${date}</div>
                <div class="print-meta">Total Orders: ${orders.length}</div>
            </div>
            <table>
                <colgroup>
                    <col class="order-id" />
                    <col class="customer" />
                    <col class="phone" />
                    <col class="address" />
                    <col class="amount" />
                    <col class="status" />
                    <col class="time" />
                    <col class="payment" />
                </colgroup>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Amount (₹)</th>
                        <th>Status</th>
                        <th>Order Time</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td class="order-id">${order.order_id || 'N/A'}</td>
                            <td>${order.user_name || 'N/A'}</td>
                            <td>${order.contact || 'N/A'}</td>
                            <td class="address">${order.address || 'N/A'}</td>
                            <td class="amount">₹${parseFloat(order.total_amount)?.toFixed(2) || '0.00'}</td>
                            <td>${order.status || 'N/A'}</td>
                            <td>${order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A'}</td>
                            <td>${order.payment_mode || 'N/A'}</td>
                        </tr>
                        ${order.orderItems && order.orderItems.length > 0 ? `
                        <tr>
                            <td colspan="8" style="padding: 0;">
                                <div class="product-header">Products (${order.orderItems.length})</div>
                                <table class="product-table">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Tag No</th>
                                            <th>S.No</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${order.orderItems.map(item => `
                                            <tr>
                                                <td>${item.product_name || 'N/A'}</td>
                                                <td>${item.tagno || 'N/A'}</td>
                                                <td>${item.sno || 'N/A'}</td>
                                                <td>${item.quantity || 0}</td>
                                                <td>₹${parseFloat(item.price)?.toFixed(2) || '0.00'}</td>
                                                <td>₹${(item.quantity * parseFloat(item.price))?.toFixed(2) || '0.00'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        ` : ''}
                    `).join('')}
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 200);
                };
            </script>
        </body>
        </html>
        `);

        printWindow.document.close();
    };

    // Loading and error states
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">Error loading orders: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Order Management
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()} color="primary">
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

            {/* Filter Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
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
                    sx={{
                        minWidth: 200,
                        maxWidth: { xs: '100%', sm: 300 },
                        width: '100%',
                        flexGrow: { xs: 1, sm: 0 }
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Status"
                    >
                        <MenuItem value="ALL">All Statuses</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="PROCESSING">Processing</MenuItem>
                        <MenuItem value="SHIPPED">Shipped</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Orders Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Table stickyHeader aria-label="order table" ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Payment Mode</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow hover>
                                        <TableCell>{order.order_id}</TableCell>
                                        <TableCell>{order.user_name}</TableCell>
                                        <TableCell align="right">₹{order.total_amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                                onClick={() => handleEditOrder(order)}
                                                sx={{ minWidth: 100 }}
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(order.order_time).toLocaleString()}</TableCell>
                                        <TableCell>{order.payment_mode}</TableCell>
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
                                                <Tooltip title="Edit Status">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditOrder(order)}
                                                        color="secondary"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Products">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleRowExpansion(order.id)}
                                                    >
                                                        {expandedRows[order.id] ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={expandedRows[order.id]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Products ({order.orderItems?.length || 0})
                                                    </Typography>
                                                    <Table size="small" aria-label="products">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Product</TableCell>
                                                                <TableCell>SKU</TableCell>
                                                                <TableCell align="right">Price</TableCell>
                                                                <TableCell align="right">Qty</TableCell>
                                                                <TableCell align="right">Total</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {order.orderItems?.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>
                                                                        <Box display="flex" alignItems="center">
                                                                            {item.image_path && (
                                                                                <Avatar
                                                                                    src={item.image_path}
                                                                                    alt={item.product_name}
                                                                                    sx={{ width: 40, height: 40, mr: 1 }}
                                                                                />
                                                                            )}
                                                                            {item.product_name}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>{item.item_id}-{item.tagno}</TableCell>
                                                                    <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                                    <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                colSpan={7}
                                count={data?.data?.totalOrders || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                sx={{
                                    '& .MuiTablePagination-toolbar': {
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    },
                                    '& .MuiTablePagination-spacer': {
                                        flex: 'none'
                                    }
                                }}
                            />
                        </TableRow>
                    </TableFooter>
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
                                label={`Current View (${filteredOrders.length} orders)`}
                            />
                            <FormControlLabel
                                value="full"
                                control={<Radio />}
                                label={`Full Order List (${data?.data?.totalOrders || 0} orders)`}
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExportDialog}>Cancel</Button>
                    <Button
                        onClick={handleExportConfirm}
                        color="primary"
                        variant="contained"
                        disabled={isFetchingFullList}
                        startIcon={isFetchingFullList ? <CircularProgress size={20} /> : null}
                    >
                        {isFetchingFullList ? 'Preparing...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Order Modal */}
            {selectedOrder && (
                <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Order Details - {selectedOrder.order_id}</Typography>
                            <IconButton onClick={handleCloseViewModal}>
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
                                    <Typography><strong>Name:</strong> {selectedOrder.user_name}</Typography>
                                    <Typography><strong>Contact:</strong> {selectedOrder.contact}</Typography>
                                    <Typography><strong>Email:</strong> {selectedOrder.email}</Typography>
                                    <Typography><strong>Address:</strong> {selectedOrder.address || 'N/A'}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>Order Details</Typography>
                                <Divider />
                                <Box mt={1}>
                                    <Typography>
                                        <strong>Order Date:</strong> {new Date(selectedOrder.order_time).toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        <strong>Status:</strong>
                                        <Chip
                                            label={selectedOrder.status}
                                            color={getStatusColor(selectedOrder.status)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography><strong>Payment Mode:</strong> {selectedOrder.payment_mode}</Typography>
                                    <Typography><strong>Amount:</strong> ₹{selectedOrder.total_amount.toFixed(2)}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>Products ({selectedOrder.orderItems?.length || 0})</Typography>
                                <Divider />
                                <Box mt={1}>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Tag No</TableCell>
                                                    <TableCell>S.No</TableCell>
                                                    <TableCell align="right">Quantity</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedOrder.orderItems?.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.product_name}</TableCell>
                                                        <TableCell>{item.tagno}</TableCell>
                                                        <TableCell>{item.sno}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                                        <TableCell align="right">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseViewModal} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Edit Order Modal */}
            {selectedOrder && (
                <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Edit Order - {selectedOrder.order_id}</Typography>
                            <IconButton onClick={handleCloseEditModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {formError && (
                                <Grid item xs={12}>
                                    <Alert severity="error">{formError}</Alert>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditFormChange}
                                        label="Status"
                                        disabled={updateOrderStatus.isLoading}
                                    >
                                        <MenuItem value="PENDING">Pending</MenuItem>
                                        <MenuItem value="PROCESSING">Processing</MenuItem>
                                        <MenuItem value="SHIPPED">Shipped</MenuItem>
                                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    label="Remarks"
                                    name="remarks"
                                    value={editForm.remarks}
                                    onChange={handleEditFormChange}
                                    multiline
                                    rows={8}
                                    placeholder="Enter any remarks about this status change"
                                    disabled={updateOrderStatus.isLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Payment Mode</InputLabel>
                                    <Select
                                        name="paymentMode"
                                        value={editForm.paymentMode}
                                        onChange={handleEditFormChange}
                                        label="Payment Mode"
                                        disabled={updateOrderStatus.isLoading}
                                    >
                                        <MenuItem value="ONLINE">Online</MenuItem>
                                        <MenuItem value="CASH_ON_DELIVERY">Cash on Delivery</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditModal} disabled={updateOrderStatus.isLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            color="primary"
                            variant="contained"
                            disabled={updateOrderStatus.isLoading}
                            startIcon={updateOrderStatus.isLoading ? <CircularProgress size={20} /> : null}
                        >
                            {updateOrderStatus.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default OrderStatusManagement;