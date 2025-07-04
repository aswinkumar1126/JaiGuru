import React, { useState, useEffect, useRef } from 'react';
import useEstimationQuery from '../../../hooks/products/useEstimationQuery';
import { useMediaQuery } from 'react-responsive';
import { CSVLink } from 'react-csv';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
    Grid, IconButton, Chip, Collapse, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Stack
} from '@mui/material';
import { Download, PictureAsPdf, Print, ExpandMore, ExpandLess } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EstimationProductsPage = () => {
    const { data, isLoading, isError, refetch } = useEstimationQuery();
    const [exportData, setExportData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [visibleItems, setVisibleItems] = useState(50);
    const [loadedData, setLoadedData] = useState([]);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [currentExportType, setCurrentExportType] = useState(null);
    const printRef = useRef(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 480px)' });

    // Process data when it changes
    useEffect(() => {
        if (data) {
            const processedData = Array.isArray(data) ? data : [data];
            setLoadedData(processedData);
        }
    }, [data]);

    const loadMoreItems = () => {
        setVisibleItems(prev => prev + 20);
    };

    const toggleRowExpansion = (subItemId) => {
        setExpandedRows(prev => ({
            ...prev,
            [subItemId]: !prev[subItemId]
        }));
    };

    const formatCurrency = (value, decimals = 2) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(numValue)) return '₹0.00';

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(numValue).replace('INR', '₹').replace(/\s/g, '');
    };

    const prepareExportData = () => {
        if (!Array.isArray(loadedData)) return [loadedData].filter(Boolean);
        return loadedData.map(item => ({
            'Name': `${item.ITEMNAME}`,
            'SubItemName': `${item.SUBITEMNAME}`,
            'SKU': `${item.ITEMID}-${item.TAGNO}`,
            'Description': item.Description || 'N/A',
            'PCS': item.PCS,
            'Rate': formatCurrency(item.Rate),
            'Gross Amount': formatCurrency(item.GrossAmount),
            'GST (%)': item.GSTPer,
            'GST Amount': formatCurrency(item.GSTAmount),
            'Grand Total': formatCurrency(item.GrandTotal),
            'Purity': `${item.PURITY}`,
            'Net Weight': `${item.NETWT}g`,
            'Gross Weight': `${item.GRSWT}g`,
            'Wastage': `${item.Wastage}`,
            'Making Charges': formatCurrency(item.MC),
            'Stone Amount': formatCurrency(item.StoneAmount),
            'Misc Amount': formatCurrency(item.MiscAmount)
        }));
    };

    const handleExportClick = (type) => {
        setCurrentExportType(type);
        setExportDialogOpen(true);
    };

    const handleExportConfirm = (exportAll) => {
        setExportDialogOpen(false);

        switch (currentExportType) {
            case 'csv':
                handleExportCSV(exportAll);
                break;
            case 'excel':
                handleExportExcel(exportAll);
                break;
            case 'pdf':
                handleExportPDF(exportAll);
                break;
            case 'print':
                handlePrint(exportAll);
                break;
            default:
                break;
        }
    };

    const handleExportCSV = (exportAll) => {
        setExportData(exportAll ? prepareExportData() : prepareExportData().slice(0, visibleItems));
        // The actual download will be triggered by the hidden CSVLink component
    };

    const handlePrint = (printAll) => {
        const dataToPrint = printAll ? loadedData : loadedData.slice(0, visibleItems);

        const tableRows = dataToPrint.map(item => `
            <tr>
                <td style="text-align:left">${item.ITEMID}-${item.TAGNO}</td>
                <td style="text-align:left">${item.Description || 'No description'}</td>
                <td style="text-align:right">${item.NETWT}g</td>
                <td style="text-align:right">${item.GRSWT}g</td>
                <td style="text-align:right">${item.Wastage}%</td>
                <td style="text-align:right">${formatCurrency(item.GrossAmount)}</td>
                <td style="text-align:right">${item.GSTPer}%</td>
                <td style="text-align:right">${formatCurrency(item.GSTAmount)}</td>
                <td style="text-align:right"><strong>${formatCurrency(item.GrandTotal)}</strong></td>
            </tr>
        `).join('');

        const printWindow = window.open('', '', 'width=1000,height=700');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Product Estimation Print</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h2 {
                            color: #2196f3;
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .generated-date {
                            font-size: 12px;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 12px;
                        }
                        th {
                            background-color: #2196f3;
                            color: white;
                            padding: 8px;
                            text-align: left;
                            border: 1px solid #ccc;
                        }
                        td {
                            padding: 6px;
                            border: 1px solid #ccc;
                        }
                        .summary {
                            margin-top: 20px;
                            font-size: 14px;
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    <h2>Product Estimation Report</h2>
                    <div class="generated-date">Generated: ${new Date().toLocaleString()}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Description</th>
                                <th>Net WT</th>
                                <th>GRS WT</th>
                                <th>Wastage</th>
                                <th>Amount</th>
                                <th>GST%</th>
                                <th>GST Amt</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    <div class="summary">
                        <strong>Total Products: ${dataToPrint.length}</strong><br>
                        <strong>Grand Total: ${formatCurrency(dataToPrint.reduce((sum, item) => sum + parseFloat(item.GrandTotal), 0))}</strong>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
    const handleExportExcel = (exportAll) => {
        const rawData = exportAll ? prepareExportData() : prepareExportData().slice(0, visibleItems);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rawData, { cellStyles: true });

        // Column widths
        worksheet['!cols'] = [
            { wch: 12 },  // SKU
            { wch: 50 },  // Description
            { wch: 8 },   // PCS
            { wch: 15 },  // Rate
            { wch: 18 },  // Gross Amount
            { wch: 10 },  // GST (%)
            { wch: 15 },  // GST Amount
            { wch: 18 },  // Grand Total
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
            { wch: 15 } ,  // Purity
        ];

        const range = XLSX.utils.decode_range(worksheet['!ref']);

        // Format header row
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: C });
            const cell = worksheet[cellRef];
            if (cell) {
                cell.s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4472C4" } }, // Dark Blue
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
        }

        // Format body rows
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellRef];
                if (!cell) continue;

                if (!cell.s) cell.s = {};

                // Numeric columns
                if ([3, 4, 6, 7,  12, 13 , 14].includes(C)) {
                    if (typeof cell.v === 'string' && cell.v.includes("₹")) {
                        const clean = parseFloat(cell.v.replace(/[₹,]/g, ""));
                        if (!isNaN(clean)) {
                            cell.v = clean;
                            cell.t = 'n';
                        }
                    }

                    cell.s.alignment = { horizontal: "right" };
                    cell.s.numFmt = '"₹"#,##0.00';
                } else if (C === 5) {
                    cell.s.alignment = { horizontal: "center" };
                } else {
                    cell.s.alignment = { horizontal: "left" };
                }

                // Borders
                cell.s.border = {
                    top: { style: "thin", color: { rgb: "D9D9D9" } },
                    bottom: { style: "thin", color: { rgb: "D9D9D9" } },
                    left: { style: "thin", color: { rgb: "D9D9D9" } },
                    right: { style: "thin", color: { rgb: "D9D9D9" } }
                };
            }
        }

        // Add total row
        const totalRowIdx = range.e.r + 1;
        const totalRow = [
            `Total: ${rawData.length} items`, '', '', '',
            { f: `SUM(E2:E${totalRowIdx})` },
            '',
            { f: `SUM(G2:G${totalRowIdx})` },
            { f: `SUM(H2:H${totalRowIdx})` },
            ''
        ];

        XLSX.utils.sheet_add_aoa(worksheet, [totalRow], { origin: -1 });

        // Format total row
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: totalRowIdx, c: C });
            const cell = worksheet[cellRef];
            if (!cell) continue;

            if (!cell.s) cell.s = {};
            cell.s.font = { bold: true };
            cell.s.fill = { fgColor: { rgb: "F2F2F2" } };
            cell.s.border = {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            };

            if ([4, 6, 7].includes(C)) {
                cell.s.numFmt = '"₹"#,##0.00';
                cell.s.alignment = { horizontal: "right" };
            }
        }

        // Save the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estimations");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
            cellStyles: true
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(blob, `Product_Estimations_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };
    
    
    

    const handleExportPDF = (exportAll) => {
        const doc = new jsPDF({ orientation: 'landscape' }); // Landscape to allow more space
        const dataToExport = exportAll ? loadedData : loadedData.slice(0, visibleItems);
        const totalCount = dataToExport.length;
        const grandTotal = dataToExport.reduce((sum, item) => sum + parseFloat(item.GrandTotal || 0), 0);

        // Title and header
        doc.setFontSize(16);
        doc.setTextColor(33, 150, 243); // Blue
        doc.text('Product Estimation Report', 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

        autoTable(doc, {
            startY: 35,
            head: [['SKU', 'Purity', 'Net WT', 'GRS WT', 'Wastage ', 'Amount ', 'GST ', 'Total ']],
            body: dataToExport.map(item => [
                `${item.ITEMID}-${item.TAGNO}`,
                `${item.PURITY || ''}`,
                `${item.NETWT}g`,
                `${item.GRSWT}g`,
                `${item.Wastage}`,
                `${item.GrossAmount}`,
                `${item.GSTPer} - ${item.GSTAmount}`,
                `${item.GrandTotal}`
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [33, 150, 243],
                textColor: [255, 255, 255],
                fontSize: 9
            },
            columnStyles: {
                0: { cellWidth: 25, halign: 'left' },   // SKU
                1: { cellWidth: 20, halign: 'center' }, // Purity
                2: { cellWidth: 25, halign: 'right' },  // Net WT
                3: { cellWidth: 25, halign: 'right' },  // GRS WT
                4: { cellWidth: 25, halign: 'right' },  // Wastage
                5: { cellWidth: 35, halign: 'right' },  // Amount
                6: { cellWidth: 35, halign: 'right' },  // GST
                7: { cellWidth: 35, halign: 'right' }   // Total
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                valign: 'middle'
            },
            margin: { top: 30, left: 10, right: 10 }
        });

        // Summary Section
        const finalY = doc.lastAutoTable.finalY || 35;
        doc.setFontSize(10);
        doc.text(`Total Products: ${totalCount}`, 14, finalY + 10);
        doc.text(`Grand Total: ${grandTotal.toFixed(2) }`, 14, finalY + 16);

        doc.save(`estimations_${new Date().toISOString().slice(0, 10)}.pdf`);
    };
    

    if (isError) {
        return (
            <Box p={3}>
                <Alert severity="error">Failed to load estimation products. Please try again.</Alert>
                <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box p={isMobile ? 1 : 3}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid item>
                    <Typography variant={isMobile ? 'h6' : 'h4'}>
                        Product Estimations
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Print />}
                            onClick={() => handleExportClick('print')}
                            size={isSmallScreen ? 'small' : 'medium'}
                        >
                            {isSmallScreen ? 'Print' : 'Print Report'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PictureAsPdf />}
                            onClick={() => handleExportClick('pdf')}
                            size={isSmallScreen ? 'small' : 'medium'}
                        >
                            {isSmallScreen ? 'PDF' : 'Export PDF'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => handleExportClick('excel')}
                            size={isSmallScreen ? 'small' : 'medium'}
                        >
                            {isSmallScreen ? 'Excel' : 'Export Excel'}
                        </Button>
                    
                        {exportData.length > 0 && (
                            <CSVLink
                                data={exportData}
                                filename={`estimations_${new Date().toISOString().slice(0, 10)}.csv`}
                                onClick={() => setExportData([])}
                                style={{ display: 'none' }}
                            />
                        )}
                    </Stack>
                </Grid>
            </Grid>

            {isLoading ? (
                <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
            ) : (
                <>
                    <Box mb={2}>
                        <Typography variant="subtitle1">
                            Showing {Math.min(visibleItems, loadedData.length)} of {loadedData.length} products
                        </Typography>
                    </Box>
                    <div ref={printRef}>
                        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                            <Table stickyHeader size={isSmallScreen ? 'small' : 'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>SubItemName</TableCell>
                                        <TableCell>SKU</TableCell>
                                        <TableCell>Details</TableCell>
                                        {!isMobile && <TableCell>Purity/Weight</TableCell>}
                                        <TableCell align="center">Amount</TableCell>
                                        <TableCell align="center">GST</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loadedData.length > 0 ? (
                                        loadedData.slice(0, visibleItems).map((item, index) => (
                                            <React.Fragment key={`${item.SubItemId}-${item.ITEMID}-${index}`}>
                                                <TableRow hover>
                                                    <TableCell>
                                                        {item.ITEMNAME}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.SUBITEMNAME}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.ITEMID}-{item.TAGNO}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                                {item.Description || 'No description'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    {!isMobile && (
                                                        <TableCell>
                                                            <Box>
                                                                <Typography variant="body2">{item.PURITY}</Typography>
                                                                <Typography variant="caption">
                                                                    {item.NETWT}g (Gross: {item.GRSWT}g)
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                    <TableCell align="right">{formatCurrency(item.GrossAmount)}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={`${item.GSTPer} (${formatCurrency(item.GSTAmount)})`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                                color: 'primary.main'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography fontWeight="bold">
                                                            {formatCurrency(item.GrandTotal)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleRowExpansion(item.SubItemId)}
                                                                color="primary"
                                                            >
                                                                {expandedRows[item.SubItemId] ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={isMobile ? 6 : 7} sx={{ py: 0, borderBottom: expandedRows[item.SubItemId] ? '1px solid rgba(224, 224, 224, 1)' : 0 }}>
                                                        <Collapse in={expandedRows[item.SubItemId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} md={6}>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            Additional Details
                                                                        </Typography>
                                                                        <Table size="small" sx={{ float: isMobile ? 'none' : 'right' }}>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell>Wastage</TableCell>
                                                                                    <TableCell align='right'>{item.Wastage}%</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>Making Charges</TableCell>
                                                                                    <TableCell align='right'>{item.MC}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>Stone Amount</TableCell>
                                                                                    <TableCell align='right'>{formatCurrency(item.StoneAmount)}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>Misc Amount</TableCell>
                                                                                    <TableCell align='right'>{formatCurrency(item.MiscAmount)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={6}>
                                                                        <Typography variant="subtitle2" gutterBottom>
                                                                            Calculation Breakdown
                                                                        </Typography>
                                                                        <Table size="small">
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell>Gross Amount</TableCell>
                                                                                    <TableCell align='right'>{formatCurrency(item.GrossAmount)}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>GST ({item.GSTPer}%)</TableCell>
                                                                                    <TableCell align='right'>{formatCurrency(item.GSTAmount)}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>
                                                                                        <Typography fontWeight="bold">Grand Total</Typography>
                                                                                    </TableCell>
                                                                                    <TableCell align='right'>
                                                                                        <Typography fontWeight="bold">
                                                                                            {formatCurrency(item.GrandTotal)}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={isMobile ? 6 : 7} align="center">
                                                No estimation products found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    {loadedData.length > visibleItems && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button
                                variant="outlined"
                                onClick={loadMoreItems}
                                disabled={isLoading}
                                size={isSmallScreen ? 'small' : 'medium'}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Load More (20 items)'}
                            </Button>
                        </Box>
                    )}

                    {/* Export Confirmation Dialog */}
                    <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                        <DialogTitle>Export Options</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Do you want to export all {loadedData.length} products or just the currently visible {Math.min(visibleItems, loadedData.length)} products?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleExportConfirm(false)} color="primary">
                                Current View ({Math.min(visibleItems, loadedData.length)})
                            </Button>
                            <Button onClick={() => handleExportConfirm(true)} color="primary" variant="contained">
                                All Products ({loadedData.length})
                            </Button>
                            <Button onClick={() => setExportDialogOpen(false)} color="secondary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default EstimationProductsPage;