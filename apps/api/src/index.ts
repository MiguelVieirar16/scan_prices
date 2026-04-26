import Fastify from "fastify";
import cors from "@fastify/cors";
import { createLogger } from "@scan/logger";
import { config } from "./config/env.js";
import { registerRoutes } from "./routes/index.js";
import { httpErrorHandler } from "./utils/http-error-handler.js";

const logger = createLogger();

async function bootstrap(): Promise<void> {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  });

  app.setErrorHandler(httpErrorHandler);
  await registerRoutes(app);

  await app.listen({ port: config.apiPort, host: "0.0.0.0" });
  logger.info("API listening", { port: config.apiPort });
}

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap API", { error: error.message });
  process.exit(1);
});
