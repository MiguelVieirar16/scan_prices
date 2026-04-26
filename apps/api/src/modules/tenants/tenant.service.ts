import { NotFoundError } from "../../core/errors.js";
import { findTenantApiProfile } from "./tenant.repository.js";

export async function getTenantApiProfile(tenantCode: string): Promise<{
  tenantCode: string;
  commerceName: string;
  apiVersion: string;
  endpointBase: string;
  supportsStorefrontQr: boolean;
  supportsPriceLookup: boolean;
  supportsManualRate: boolean;
  supportedIntegrationTypes: Array<"api" | "csv" | "db_readonly">;
}> {
  const row = await findTenantApiProfile(tenantCode);

  if (!row) {
    throw new NotFoundError("Perfil API del comercio no encontrado.");
  }

  return {
    tenantCode: row.tenantCode,
    commerceName: row.commerceName,
    apiVersion: row.apiVersion,
    endpointBase: `/api/${row.apiVersion}`,
    supportsStorefrontQr: row.supportsStorefrontQr,
    supportsPriceLookup: row.supportsPriceLookup,
    supportsManualRate: row.supportsManualRate,
    supportedIntegrationTypes: row.supportedIntegrationTypes
  };
}
