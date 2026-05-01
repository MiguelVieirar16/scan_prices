import { PriceLookupResponse } from "@scan/shared-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

console.log("[PRICE-API] API_BASE_URL:", API_BASE_URL);

export async function getPriceByBarcode(input: {
  tenantCode: string;
  storeCode: string;
  barcode: string;
}): Promise<PriceLookupResponse> {
  console.log("[PRICE-API] getPriceByBarcode called:", input);
  const endpoint = new URL(`${API_BASE_URL}/api/v1/prices/${input.barcode}`);
  endpoint.searchParams.set("tenantCode", input.tenantCode);
  endpoint.searchParams.set("storeCode", input.storeCode);
  console.log("[PRICE-API] Request URL:", endpoint.toString());

  const response = await fetch(endpoint.toString());
  console.log("[PRICE-API] Response status:", response.status, response.statusText);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    console.log("[PRICE-API] Error response:", body);
    throw new Error(body?.message ?? "No se pudo consultar el precio.");
  }

  const data = (await response.json()) as PriceLookupResponse;
  console.log("[PRICE-API] Response data:", data);
  return data;
}
