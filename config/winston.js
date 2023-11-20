import { createLogger, format, transports } from "winston";
import fs from "fs";

const env = process.env.NODE_ENV || "development";
const logDir = "log";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
});

export const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
