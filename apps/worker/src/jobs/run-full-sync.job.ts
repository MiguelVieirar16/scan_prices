import { createLogger } from "@scan/logger";
import { getTenantConnectors } from "../connectors/registry.js";
import { syncTenantPrices } from "../services/sync-prices.service.js";

const logger = createLogger();

export async function runFullSyncJob(): Promise<void> {
  logger.info("Starting full sync job");

  const connectors = getTenantConnectors();

  for (const connector of connectors) {
    await syncTenantPrices(connector);
  }

  logger.info("Full sync job finished", { connectors: connectors.length });
}
