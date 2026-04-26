import { FastifyInstance } from "fastify";
import { healthRoute } from "../modules/health/health.route.js";
import { priceRoute } from "../modules/prices/price.route.js";
import { integrationRoute } from "../modules/integrations/integration.route.js";
import { rateRoute } from "../modules/rates/rate.route.js";
import { storefrontRoute } from "../modules/storefronts/storefront.route.js";
import { tenantRoute } from "../modules/tenants/tenant.route.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await healthRoute(app);
  await rateRoute(app);
  await tenantRoute(app);
  await storefrontRoute(app);
  await priceRoute(app);
  await integrationRoute(app);
}
