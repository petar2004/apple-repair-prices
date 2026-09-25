import ExcelJS from "exceljs";
import { RepairPrice } from "../types.js";

async function exportToExcel(prices: RepairPrice[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Repair Prices");

    worksheet.columns = [
        { header: "Model", key: "model", width: 30 },
        { header: "Repair", key: "repair", width: 35 },
        { header: "Price (SEK)", key: "price", width: 15 },
    ];

    for (const price of prices) {
        worksheet.addRow(price);
    }

    await workbook.xlsx.writeFile("apple-repair-prices.xlsx");
}

export { exportToExcel };