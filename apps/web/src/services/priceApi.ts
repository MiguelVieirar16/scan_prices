import { PriceLookupResponse } from "@scan/shared-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function getPriceByBarcode(input: {
  tenantCode: string;
  storeCode: string;
  barcode: string;
}): Promise<PriceLookupResponse> {
  const endpoint = new URL(`${API_BASE_URL}/api/v1/prices/${input.barcode}`);
  endpoint.searchParams.set("tenantCode", input.tenantCode);
  endpoint.searchParams.set("storeCode", input.storeCode);

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo consultar el precio.");
  }

  return (await response.json()) as PriceLookupResponse;
}
