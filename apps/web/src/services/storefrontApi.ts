import { StorefrontConfig } from "@scan/shared-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function getStorefrontByCode(storefrontCode: string): Promise<StorefrontConfig> {
  const response = await fetch(`${API_BASE_URL}/api/v1/storefronts/${storefrontCode}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo cargar la tienda del QR.");
  }

  return (await response.json()) as StorefrontConfig;
}
