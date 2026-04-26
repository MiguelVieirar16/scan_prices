import { FastifyInstance } from "fastify";
import { z } from "zod";
import { config } from "../../config/env.js";
import {
  getUsdToVesRate,
  getUsdToVesRateHistory,
  setManualUsdToVesRate
} from "./rate.service.js";

const manualRateBodySchema = z.object({
  rate: z.number().positive().max(100000),
  provider: z.string().min(2).max(80).optional(),
  note: z.string().max(280).optional()
});

const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional()
});

function canSetManualRate(adminKeyHeader: string | undefined): boolean {
  // En local/dev puedes operar sin llave si no fue configurada.
  if (!config.fxAdminKey && config.nodeEnv !== "production") {
    return true;
  }

  return Boolean(config.fxAdminKey && adminKeyHeader && adminKeyHeader === config.fxAdminKey);
}

export async function rateRoute(app: FastifyInstance): Promise<void> {
  app.get("/api/v1/rates/latest", async (_request, reply) => {
    const rate = await getUsdToVesRate();
    return reply.send(rate);
  });

  app.get("/api/v1/rates/history", async (request, reply) => {
    const query = historyQuerySchema.parse(request.query);
    const items = await getUsdToVesRateHistory(query.limit ?? 20);
    return reply.send({ items });
  });

  app.post("/api/v1/rates/manual", async (request, reply) => {
    const adminKey = request.headers["x-admin-key"] as string | undefined;

    if (!canSetManualRate(adminKey)) {
      return reply.code(401).send({
        error: "unauthorized",
        message: "x-admin-key invalido o no configurado."
      });
    }

    const body = manualRateBodySchema.parse(request.body);

    const updated = await setManualUsdToVesRate({
      value: body.rate,
      provider: body.provider ?? "manual_backoffice",
      note: body.note
    });

    return reply.code(201).send(updated);
  });
}
