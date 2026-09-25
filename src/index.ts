import { RepairPrice } from "../types.js";
import { exportToExcel } from "./excel.js";

const repairPageUrl = "https://support.apple.com/sv-se/iphone/repair?services=service";

async function getProductId(): Promise<string> {
    const response = await fetch(repairPageUrl)

    if (!response.ok) {
        throw new Error("Failed to fetch link");
    }

    const html = await response.text();
    const match = html.match(/pricingProductId:\s*["']([^"']+)["']/);

    if (!match) {
        throw new Error("Pricing product Id cant be found")
    }

    return match[1]!;
}

async function getRepairPrices(productId: string): Promise<any> {
    const url = new URL(`https://support.apple.com/ols/api/pricing/products/services/pricing-estimate`);

    url.searchParams.append("locale", "sv-se");
    url.searchParams.append("pricing_type", "OOW");
    url.searchParams.append("parent_tag_id", productId);

    const response = await fetch(url, {
        headers: {
            Referer: repairPageUrl,
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch repair prices");
    }

    const data = await response.json();

    return data;
}

function parseRepairPrices(data: any): RepairPrice[] {
    const result: RepairPrice[] = [];

    for (const product of data.products) {
        const models = product.childrenProducts ?? [product];

        for (const model of models) {
            for (const service of model.services ?? []) {
                const price = Number(
                    service.price
                        .replace("SEK", "")
                        .replace(/\s/g, "")
                );

                result.push({
                    model: model.product_loc_title,
                    repair: service.serviceLabel,
                    price,
                });
            }
        }
    }

    return result;
}

async function main() {
    const productId = await getProductId();
    const data = await getRepairPrices(productId);

    const prices = parseRepairPrices(data);

    await exportToExcel(prices);
}

main()