import { FastifyInstance } from "fastify";

export async function healthRoute(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    return {
      ok: true,
      service: "scan-api",
      timestamp: new Date().toISOString()
    };
  });
}
