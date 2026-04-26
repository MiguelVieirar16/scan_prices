export interface RemotePriceRow {
  barcode: string;
  sku: string;
  productName: string;
  storeCode: string;
  currency: "USD" | "VES";
  amount: number;
  observedAt: string;
}

export interface TenantSyncConnector {
  tenantCode: string;
  fetchLatestPrices: () => Promise<RemotePriceRow[]>;
}
