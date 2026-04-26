import dotenv from "dotenv";
import { createLogger } from "@scan/logger";
import { runFullSyncJob } from "./jobs/run-full-sync.job.js";

dotenv.config();

const logger = createLogger();

async function bootstrap(): Promise<void> {
  logger.info("Worker started");
  await runFullSyncJob();

  // Ciclo simple para demo. En producción usa cola (BullMQ/SQS/Kafka) y cron.
  setInterval(() => {
    void runFullSyncJob();
  }, 5 * 60 * 1000);
}

bootstrap().catch((error) => {
  logger.error("Worker failed", { error: error.message });
  process.exit(1);
});
