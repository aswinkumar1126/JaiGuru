// src/app/layout/utils/ExportCallListPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportCallListPDF = (columns = [], data = [], fileName = 'call-list.pdf') => {
    const doc = new jsPDF();

    const tableColumn = columns.map((col) => col.headerName || col.label || col);
    const tableRows = data.map((row) =>
        columns.map((col) => row[col.field || col])
    );

    doc.text(fileName.replace('.pdf', ''), 14, 15);
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save(fileName);
};

export default ExportCallListPDF;
