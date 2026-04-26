import { createLogger } from "@scan/logger";
import { TenantSyncConnector } from "../connectors/types.js";

const logger = createLogger();

export async function syncTenantPrices(connector: TenantSyncConnector): Promise<void> {
  const rows = await connector.fetchLatestPrices();

  // Placeholder: aquí persistes en products/prices vía API interna o DB.
  logger.info("Sync completed", {
    tenantCode: connector.tenantCode,
    records: rows.length,
    sample: rows[0] ?? null
  });
}
