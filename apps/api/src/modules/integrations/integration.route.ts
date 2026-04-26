import { FastifyInstance } from "fastify";

export async function integrationRoute(app: FastifyInstance): Promise<void> {
  app.post("/api/v1/integrations/:tenantCode/sync", async (request, reply) => {
    const { tenantCode } = request.params as { tenantCode: string };

    // Endpoint preparado para disparar sincronización asíncrona por tenant.
    // En producción encola un job en Redis/BullMQ y retorna un jobId.
    return reply.code(202).send({
      accepted: true,
      tenantCode,
      message: "Sincronización encolada (placeholder)."
    });
  });
}
