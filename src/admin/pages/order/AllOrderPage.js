import React, { useState, useRef } from 'react';
import { useAllOrders } from '../../hooks/order/useAllOrder';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
    TableFooter
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
    LastPage
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx-js-style';
import './OrderManagement.css';

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
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

const OrderManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const tableRef = useRef();

    const { data, isLoading, isError, error, refetch } = useAllOrders(page, rowsPerPage);

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

    const handleRefresh = () => {
        refetch();
    };

    const filteredOrders = data?.data?.orders?.filter(order => {
        const matchesSearch =
            order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) || [];

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const table = tableRef.current;

        doc.text('Order Management Report', 14, 15);

        doc.autoTable({
            html: table,
            startY: 20,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' },
                5: { cellWidth: 'auto' },
                6: { cellWidth: 'auto' }
            },
            margin: { top: 20 }
        });

        doc.save('orders_report.pdf');
    };


    const exportToExcel = () => {
        const header = [
            'Order ID',
            'Customer Name',
            'Contact',
            'Amount (₹)',
            'Status',
            'Order Date',
            'Address',
            'Payment Mode'
        ];

        const data = filteredOrders.map(order => [
            order.order_id,
            order.user_name,
            order.contact,
            `₹${order.total_amount.toFixed(2)}`,
            order.status,
            new Date(order.order_time).toLocaleString(),
            order.address,
            order.payment_mode || 'N/A'
        ]);

        const worksheetData = [header, ...data];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Add styles to header
        header.forEach((_, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Row 0 = header
            if (!worksheet[cellAddress]) return;

            worksheet[cellAddress].s = {
                fill: {
                    fgColor: { rgb: "FF6200" }  // Orange
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" }    // White
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                }
            };
        });

        // Set column widths
        worksheet['!cols'] = [
            { wch: 15 },
            { wch: 20 },
            { wch: 15 },
            { wch: 12 },
            { wch: 12 },
            { wch: 22 },
            { wch: 80 },
            { wch: 15 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, `orders_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handlePrint = () => {
        window.print();
    };

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
        <Box sx={{ width: '100%', overflow: 'hidden', p: 2 }} className="order-management-container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Order Management
                </Typography>
                <Box>
                    <Tooltip title="Refresh">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to PDF">
                        <IconButton onClick={exportToPDF} color="secondary">
                            <PdfIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to Excel">
                        <IconButton onClick={exportToExcel} color="success">
                            <ExcelIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                        <IconButton onClick={handlePrint}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

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
                    sx={{ minWidth: 250 }}
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

            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Table stickyHeader aria-label="order table" ref={tableRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Payment Mode</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.order_id}</TableCell>
                                    <TableCell>{order.user_name}</TableCell>                                    <TableCell>{order.contact}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell align="right">₹{order.total_amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color={
                                                order.status === 'PENDING' ? 'warning' :
                                                    order.status === 'PROCESSING' ? 'info' :
                                                        order.status === 'SHIPPED' ? 'primary' :
                                                            order.status === 'DELIVERED' ? 'success' : 'error'
                                            }
                                            sx={{
                                                textTransform: 'none',
                                                pointerEvents: 'none',
                                                minWidth: 100
                                            }}
                                        >
                                            {order.status}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{new Date(order.order_time).toLocaleString()}</TableCell>
                                    <TableCell>{order.payment_mode || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                colSpan={9}
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
                                    '& .MuiTablePagination-selectLabel': {
                                        marginTop: 'auto',
                                        marginBottom: 'auto'
                                    },
                                    '& .MuiTablePagination-displayedRows': {
                                        marginTop: 'auto',
                                        marginBottom: 'auto'
                                    }
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            {/* Order Details Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Order Details - {selectedOrder?.order_id}</Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedOrder && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>Customer Information</Typography>
                                <Divider />
                                <Box mt={2}>
                                    <Typography><strong>Name:</strong> {selectedOrder.user_name}</Typography>
                                    <Typography><strong>Contact:</strong> {selectedOrder.contact}</Typography>
                                    <Typography><strong>Email:</strong> {selectedOrder.email}</Typography>
                                    <Typography><strong>Address:</strong> {selectedOrder.address}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>Order Information</Typography>
                                <Divider />
                                <Box mt={2}>
                                    <Typography><strong>Order Date:</strong> {new Date(selectedOrder.order_time).toLocaleString()}</Typography>
                                    <Typography><strong>Status:</strong>
                                        <Chip
                                            label={selectedOrder.status}
                                            color={
                                                selectedOrder.status === 'PENDING' ? 'warning' :
                                                    selectedOrder.status === 'PROCESSING' ? 'info' :
                                                        selectedOrder.status === 'SHIPPED' ? 'primary' :
                                                            selectedOrder.status === 'DELIVERED' ? 'success' : 'error'
                                            }
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography><strong>Payment Mode:</strong> {selectedOrder.payment_mode || 'N/A'}</Typography>
                                    <Typography><strong>Total Amount:</strong> ₹{selectedOrder.total_amount.toFixed(2)}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>Products</Typography>
                                <Divider />
                                <Box mt={2}>
                                    {/* Replace this with actual product data when available */}
                                    <Typography>Product details would be displayed here</Typography>
                                    {/* Example structure when you have product data:
                                    {selectedOrder.products.map((product) => (
                                        <Box key={product.id} mb={2}>
                                            <Typography><strong>{product.name}</strong></Typography>
                                            <Typography>Quantity: {product.quantity}</Typography>
                                            <Typography>Price: ₹{product.price}</Typography>
                                        </Box>
                                    ))}
                                    */}
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderManagement;