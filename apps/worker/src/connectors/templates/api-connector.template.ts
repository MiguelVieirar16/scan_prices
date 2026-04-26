import { TenantSyncConnector } from "../types.js";

interface ApiConnectorConfig {
  tenantCode: string;
  endpoint: string;
  token: string;
}

export function createApiConnector(config: ApiConnectorConfig): TenantSyncConnector {
  return {
    tenantCode: config.tenantCode,
    async fetchLatestPrices() {
      const response = await fetch(config.endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`API connector failed with status ${response.status}`);
      }

      const data = (await response.json()) as Array<{
        barcode: string;
        sku: string;
        productName: string;
        storeCode: string;
        currency: "USD" | "VES";
        amount: number;
        observedAt: string;
      }>;

      return data;
    }
  };
}
