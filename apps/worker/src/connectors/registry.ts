import { demoTenantConnector } from "./demo-tenant.connector.js";
import { TenantSyncConnector } from "./types.js";

const connectors: TenantSyncConnector[] = [demoTenantConnector];

export function getTenantConnectors(): TenantSyncConnector[] {
  return connectors;
}
