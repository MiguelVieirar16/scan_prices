import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getPriceByBarcode } from "./price.service.js";

const paramsSchema = z.object({
  barcode: z.string().min(8).max(20)
});

const querySchema = z.object({
  tenantCode: z.string().min(2),
  storeCode: z.string().min(2)
});

export async function priceRoute(app: FastifyInstance): Promise<void> {
  app.get("/api/v1/prices/:barcode", async (request, reply) => {
    const params = paramsSchema.parse(request.params);
    const query = querySchema.parse(request.query);

    const response = await getPriceByBarcode({
      tenantCode: query.tenantCode,
      storeCode: query.storeCode,
      barcode: params.barcode
    });

    return reply.send(response);
  });
}
