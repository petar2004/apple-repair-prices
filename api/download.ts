import {
    getProductId,
    getRepairPrices,
    parseRepairPrices,
} from "../src/apple.js";

import { createExcel } from "../src/excel.js";

export async function GET() {
    try {
        const productId = await getProductId();

        const repairData =
            await getRepairPrices(productId);

        const prices =
            parseRepairPrices(repairData);

        const excel =
            await createExcel(prices);

        return new Response(excel, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "Content-Disposition":
                    'attachment; filename="apple-repair-prices.xlsx"',

                "Cache-Control": "no-store",
            },
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error:
                    "Could not generate Excel file",
            },
            {
                status: 500,
            }
        );
    }
}