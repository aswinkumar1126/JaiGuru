import React, { useState, useEffect } from 'react';
import { useOrdersByDateRange } from '../../hooks/order/useAllOrder';
import { format, subDays, parseISO } from 'date-fns';
import { useMediaQuery } from 'react-responsive';
import { CSVLink } from 'react-csv';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
    Grid, IconButton, Menu, MenuItem, Select, FormControl, InputLabel,
    Chip, Collapse, TableSortLabel, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Download, MoreVert, PictureAsPdf, Print, ExpandMore, ExpandLess } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderHistoryPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [exportData, setExportData] = useState([]);
    const [exportType, setExportType] = useState('csv');
    const [anchorEl, setAnchorEl] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
    const { data: orders = [], isLoading, isError, refetch } = useOrdersByDateRange(
        formattedStartDate,
        formattedEndDate
    );

    const handleQuickDateSelect = (days) => {
        const newStartDate = subDays(new Date(), days);
        setStartDate(newStartDate);
        setEndDate(new Date());
    };

    useEffect(() => {
        console.log('Start Date:', formattedStartDate);
        console.log('End Date:', formattedEndDate);
        console.log('Orders Data:', orders);
    }, [formattedStartDate, formattedEndDate, orders]);

    const toggleRowExpansion = (orderId) => {
        setExpandedRows(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const prepareExportData = () => {
        if (!Array.isArray(orders)) return [];
        return orders.map(order => ({
            'Order ID': order.orderId,
            'Customer': order.customerName,
            'Contact': order.contact,
            'Email': order.email,
            'Date': format(parseISO(order.orderTime), 'yyyy-MM-dd hh:mm a'),
            'Amount': `₹${order.totalAmount.toFixed(2)}`,
            'Status': order.status,
            'Product Count': order.orderItems.length,
            'Products': order.orderItems.map(item =>
                `${item.productName} (SKU: ${item.itemid}-${item.tagno}, Qty: ${item.quantity}, Price: ₹${item.price.toFixed(2)})`
            ).join(' | '),
            'Product Details': order.orderItems.map(item => ({
                'SKU': `${item.itemid}-${item.tagno}`,
                'Name': item.productName,
                'Price': `₹${item.price.toFixed(2)}`,
                'Quantity': item.quantity,
                'Serial No': item.sno,
                'Image': item.imagePath || 'N/A'
            }))
        }));
    };

    const handleExportClick = () => {
        setExportData(prepareExportData());
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handlePrint = () => window.print();

    const handleExportPDF = (singleOrder = null) => {
        const doc = new jsPDF();
        const dataToExport = singleOrder ? [singleOrder] : (Array.isArray(orders) ? orders : []);

        doc.setFontSize(16);
        doc.text(singleOrder ? 'Order Receipt' : 'Order History Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

        if (singleOrder) {
            doc.text(`Customer: ${singleOrder.customerName}`, 14, 40);
            doc.text(`Contact: ${singleOrder.contact}`, 14, 47);
            doc.text(`Email: ${singleOrder.email}`, 14, 54);
            doc.text(`Order ID: ${singleOrder.orderId}`, 14, 61);
            doc.text(`Order Date: ${format(parseISO(singleOrder.orderTime), 'dd/MM/yyyy hh:mm a')}`, 14, 68);
            doc.text(`Status: ${singleOrder.status.toUpperCase()}`, 14, 75);

            autoTable(doc, {
                startY: 85,
                head: [['Product', 'SKU', 'Qty', 'Unit Price', 'Total']],
                body: singleOrder.orderItems.map(item => [
                    item.productName,
                    `${item.itemid}-${item.tagno}`,
                    item.quantity,
                    `₹${item.price.toFixed(2)}`,
                    `₹${(item.price * item.quantity).toFixed(2)}`
                ]),
                foot: [[
                    '',
                    '',
                    '',
                    { content: 'Total:', styles: { fontStyle: 'bold' } },
                    { content: `₹${singleOrder.totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold' } }
                ]],
                theme: 'grid',
                headStyles: { fillColor: [33, 150, 243] }
            });
        } else {
            autoTable(doc, {
                startY: 35,
                head: [['Order ID', 'Customer', 'Date', 'Products', 'Amount', 'Status']],
                body: dataToExport.map(order => [
                    order.orderId,
                    order.customerName,
                    format(parseISO(order.orderTime), 'dd/MM/yyyy'),
                    order.orderItems.map(item => `${item.productName} (x${item.quantity})`).join('\n'),
                    `₹${order.totalAmount.toFixed(2)}`,
                    order.status.toUpperCase()
                ]),
                theme: 'grid',
                headStyles: { fillColor: [33, 150, 243] }
            });
        }

        doc.save(`${singleOrder ? 'order_' : 'orders_'}${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'primary';
        }
    };

    const totalAmount = Array.isArray(orders) ? orders.reduce((sum, order) => sum + order.totalAmount, 0) : 0;

    if (isError) {
        return (
            <Box p={3}>
                <Alert severity="error">Failed to load orders. Please try again.</Alert>
                <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={isMobile ? 1 : 3}>
                <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                    <Grid item>
                        <Typography variant={isMobile ? 'h6' : 'h4'}>
                            Order History
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box display="flex" gap={1}>
                            <IconButton onClick={handleMenuOpen}><MoreVert /></IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handlePrint}>
                                    <Print sx={{ mr: 1 }} fontSize="small" /> Print
                                </MenuItem>
                                <MenuItem onClick={() => { handleExportPDF(); handleMenuClose(); }}>
                                    <PictureAsPdf sx={{ mr: 1 }} fontSize="small" /> Export PDF
                                </MenuItem>
                                <MenuItem onClick={() => { handleExportClick(); handleMenuClose(); }}>
                                    <Download sx={{ mr: 1 }} fontSize="small" /> Export {exportType.toUpperCase()}
                                </MenuItem>
                            </Menu>
                            {exportData.length > 0 && exportType === 'csv' && (
                                <CSVLink
                                    data={exportData}
                                    filename={`orders_${format(new Date(), 'yyyyMMdd')}.csv`}
                                    onClick={() => setExportData([])}
                                    style={{ display: 'none' }}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(val) => setStartDate(val)}
                                maxDate={endDate}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(val) => setEndDate(val)}
                                minDate={startDate}
                                maxDate={new Date()}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Button variant="outlined" onClick={() => handleQuickDateSelect(0)}>Today</Button>
                                <Button variant="outlined" onClick={() => handleQuickDateSelect(7)}>Last 7 Days</Button>
                                <Button variant="outlined" onClick={() => handleQuickDateSelect(30)}>Last 30 Days</Button>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Export Format</InputLabel>
                                    <Select value={exportType} onChange={(e) => setExportType(e.target.value)} label="Export Format">
                                        <MenuItem value="csv">CSV</MenuItem>
                                        <MenuItem value="json">JSON</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                ) : (
                    <>
                        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">
                                Showing {Array.isArray(orders) ? orders.length : 0} orders
                            </Typography>
                            <Typography variant="subtitle2">
                                Total Amount: ₹{totalAmount.toFixed(2)}
                            </Typography>
                        </Box>

                        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        {!isMobile && <TableCell>Date</TableCell>}
                                        <TableCell>Customer</TableCell>
                                        {!isMobile && <TableCell>Contact</TableCell>}
                                        <TableCell>Products</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(orders) && orders.length > 0 ? (
                                        orders.map((order) => (
                                            <React.Fragment key={order.orderId}>
                                                <TableRow hover>
                                                    <TableCell>{order.orderId}</TableCell>
                                                    {!isMobile && (
                                                        <TableCell>{format(parseISO(order.orderTime), 'dd/MM/yyyy hh:mm a')}</TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2">{order.customerName}</Typography>
                                                            {isMobile && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {order.contact}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    {!isMobile && <TableCell>{order.contact}</TableCell>}
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            {order.orderItems.length} item(s)
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleRowExpansion(order.orderId)}
                                                                sx={{ ml: 1 }}
                                                            >
                                                                {expandedRows[order.orderId] ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">₹{order.totalAmount.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={order.status.toUpperCase()}
                                                            color={getStatusColor(order.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Download Receipt">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExportPDF(order)}
                                                            >
                                                                <PictureAsPdf fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={isMobile ? 5 : 7} sx={{ py: 0, borderBottom: expandedRows[order.orderId] ? '1px solid rgba(224, 224, 224, 1)' : 0 }}>
                                                        <Collapse in={expandedRows[order.orderId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Product</TableCell>
                                                                            <TableCell>SKU</TableCell>
                                                                            <TableCell align="right">Price</TableCell>
                                
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {order.orderItems.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>
                                                                                    <Box display="flex" alignItems="center">
                                                                                        {item.imagePath && (
                                                                                            <img
                                                                                                src={item.imagePath}
                                                                                                alt={item.productName}
                                                                                                style={{ width: 40, height: 40, marginRight: 8, objectFit: 'contain' }}
                                                                                            />
                                                                                        )}
                                                                                        {item.productName}
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell>{item.itemid}-{item.tagno}</TableCell>
                                                                                <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
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
                                            <TableCell colSpan={isMobile ? 6 : 8} align="center">
                                                No orders found for selected range
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {exportData.length > 0 && exportType === 'json' && (
                            <a
                                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`}
                                download={`orders_${format(new Date(), 'yyyyMMdd')}.json`}
                                style={{ display: 'none' }}
                                ref={(node) => node && node.click()}
                                onClick={() => setExportData([])}
                            />
                        )}
                    </>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default OrderHistoryPage;