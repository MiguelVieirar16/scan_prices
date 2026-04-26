import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getTenantApiProfile } from "./tenant.service.js";

const paramsSchema = z.object({
  tenantCode: z.string().min(2).max(100)
});

export async function tenantRoute(app: FastifyInstance): Promise<void> {
  app.get("/api/v1/tenants/:tenantCode/api-profile", async (request, reply) => {
    const params = paramsSchema.parse(request.params);
    const profile = await getTenantApiProfile(params.tenantCode);
    return reply.send(profile);
  });
}
