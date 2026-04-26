export interface TenantApiProfileRow {
  tenantCode: string;
  commerceName: string;
  apiVersion: string;
  supportsStorefrontQr: boolean;
  supportsPriceLookup: boolean;
  supportsManualRate: boolean;
  supportedIntegrationTypes: Array<"api" | "csv" | "db_readonly">;
}

const profiles: TenantApiProfileRow[] = [
  {
    tenantCode: "demo-market",
    commerceName: "Demo Market",
    apiVersion: "v1",
    supportsStorefrontQr: true,
    supportsPriceLookup: true,
    supportsManualRate: true,
    supportedIntegrationTypes: ["api", "csv", "db_readonly"]
  }
];

export async function findTenantApiProfile(
  tenantCode: string
): Promise<TenantApiProfileRow | null> {
  const profile = profiles.find((item) => item.tenantCode === tenantCode);
  return profile ?? null;
}
