export type CurrencyCode = "USD" | "VES";

export interface Tenant {
  id: string;
  code: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  city: string;
  address: string;
  timezone: string;
  isActive: boolean;
}

export interface StorefrontConfig {
  storefrontCode: string;
  tenantCode: string;
  storeCode: string;
  commerceName: string;
  mallName: string | null;
  welcomeMessage: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundStyle: string | null;
  fontFamily: string | null;
  isActive: boolean;
}

export interface Product {
  id: string;
  tenantId: string;
  barcode: string;
  sku: string;
  name: string;
  brand: string | null;
  category: string | null;
  isActive: boolean;
}

export interface PriceRecord {
  id: string;
  tenantId: string;
  storeId: string;
  productId: string;
  baseCurrency: CurrencyCode;
  basePrice: number;
  priceUsd: number;
  priceVes: number;
  exchangeRateUsed: number;
  source: "internal" | "external_sync";
  observedAt: string;
}

export interface ExchangeRate {
  id: string;
  provider: string;
  baseCurrency: "USD";
  quoteCurrency: "VES";
  value: number;
  effectiveAt: string;
  fetchedAt: string;
}

export interface PriceLookupResponse {
  tenantCode: string;
  storeCode: string;
  barcode: string;
  productName: string;
  priceUsd: number;
  priceVes: number;
  exchangeRate: number;
  exchangeRateProvider: string;
  updatedAt: string;
}

export interface ScanEvent {
  id: string;
  tenantId: string;
  storeId: string;
  barcode: string;
  source: "web_scanner" | "manual_input";
  scannedAt: string;
}
