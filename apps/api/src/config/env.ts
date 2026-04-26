import dotenv from "dotenv";
import { loadConfig } from "@scan/config";

dotenv.config();

export const config = loadConfig();
