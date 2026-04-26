import { readFile } from "node:fs/promises";
import { TenantSyncConnector } from "../types.js";

interface CsvConnectorConfig {
  tenantCode: string;
  csvPath: string;
}

export function createCsvConnector(config: CsvConnectorConfig): TenantSyncConnector {
  return {
    tenantCode: config.tenantCode,
    async fetchLatestPrices() {
      const content = await readFile(config.csvPath, "utf-8");
      const lines = content.split(/\r?\n/).filter(Boolean);
      const [header, ...rows] = lines;

      if (!header) return [];

      return rows.map((line) => {
        const [barcode, sku, productName, storeCode, currency, amount, observedAt] = line.split(","
        );

        return {
          barcode,
          sku,
          productName,
          storeCode,
          currency: currency as "USD" | "VES",
          amount: Number(amount),
          observedAt
        };
      });
    }
  };
}
