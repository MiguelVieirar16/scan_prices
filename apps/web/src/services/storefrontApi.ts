import { StorefrontConfig } from "@scan/shared-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

console.log("[WEB] API_BASE_URL:", API_BASE_URL);

export async function getStorefrontByCode(storefrontCode: string): Promise<StorefrontConfig> {
  console.log("[WEB] getStorefrontByCode called with:", storefrontCode);
  const url = `${API_BASE_URL}/api/v1/storefronts/${storefrontCode}`;
  console.log("[WEB] Fetching URL:", url);

  const response = await fetch(url);
  console.log("[WEB] Response status:", response.status, response.statusText);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    console.log("[WEB] Error response body:", body);
    throw new Error(body?.message ?? "No se pudo cargar la tienda del QR.");
  }

  const data = (await response.json()) as StorefrontConfig;
  console.log("[WEB] Response data:", data);
  return data;
}
