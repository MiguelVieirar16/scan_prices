import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getStorefrontByCode } from "./storefront.service.js";

const paramsSchema = z.object({
  storefrontCode: z.string().min(3).max(120)
});

export async function storefrontRoute(app: FastifyInstance): Promise<void> {
  app.get("/api/v1/storefronts/:storefrontCode", async (request, reply) => {
    const params = paramsSchema.parse(request.params);
    const storefront = await getStorefrontByCode(params.storefrontCode);
    return reply.send(storefront);
  });
}
