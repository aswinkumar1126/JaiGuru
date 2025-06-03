// src/app/layout/utils/ExportCallListExcel.js
import * as XLSX from 'xlsx';

const ExportCallListExcel = (columns = [], data = [], fileName = 'call-list.xlsx') => {
    const exportData = data.map((row) => {
        const obj = {};
        columns.forEach((col) => {
            const key = col.headerName || col.label || col.field || col;
            obj[key] = row[col.field || col];
        });
        return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, fileName);
};

export default ExportCallListExcel;
