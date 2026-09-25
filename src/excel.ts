import ExcelJS from "exceljs";
import { RepairPrice } from "../types.js";

export async function createExcel(
    prices: RepairPrice[]
) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Repair Prices");

    worksheet.columns = [
        { header: "Model", key: "model", width: 30 },
        { header: "Repair", key: "repair", width: 35 },
        { header: "Price (SEK)", key: "price", width: 18 },
    ];

    for (const price of prices) {
        worksheet.addRow(price);
    }

    worksheet.getColumn("price").numFmt = '#,##0 "kr"';

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer;
}