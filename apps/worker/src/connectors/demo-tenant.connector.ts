import { TenantSyncConnector } from "./types.js";

export const demoTenantConnector: TenantSyncConnector = {
  tenantCode: "demo-market",
  async fetchLatestPrices() {
    return [
      {
        barcode: "7591234567890",
        sku: "HAR-001",
        productName: "Harina de Maiz 1Kg",
        storeCode: "ccs-001",
        currency: "USD",
        amount: 1.6,
        observedAt: new Date().toISOString()
      },
      {
        barcode: "7590987654321",
        sku: "LEC-001",
        productName: "Leche Entera 1L",
        storeCode: "ccs-001",
        currency: "USD",
        amount: 2.15,
        observedAt: new Date().toISOString()
      }
    ];
  }
};
