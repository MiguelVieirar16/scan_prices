export interface RemotePriceRecord {
  barcode: string;
  sku: string;
  productName: string;
  price: number;
  currency: "USD" | "VES";
  storeCode: string;
  observedAt: string;
}

export interface TenantConnector {
  tenantCode: string;
  fetchLatestPrices: () => Promise<RemotePriceRecord[]>;
}
