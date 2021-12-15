"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, errors, prettyPrint, printf } = format;
const timestampFormat = { format: "YYYY-MM-DD HH:mm:ss" };

const logger = createLogger({
  defaultMeta: { service: "my-chat-service" },
  transports: [
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(
        timestamp(timestampFormat),
        errors({ stack: true }),
        prettyPrint()
      ),
    }),
    new transports.File({
      filename: "debug.log",
      level: "debug",
      format: combine(
        timestamp(timestampFormat),
        errors({ stack: true }),
        prettyPrint()
      ),
    }),
    new transports.Console({
      level: "debug",
      format: combine(
        colorize(),
        timestamp(timestampFormat),
        errors({ stack: true }),
        printf(({ timestamp, level, message, stack, ...metadata }) => {
          let msg = "";
          if (!stack) {
            msg = `${timestamp} [${level}]: ${message} `;
          } else {
            msg = `${timestamp} [${level}]: ${stack} `;
          }

          if (metadata) {
            msg += JSON.stringify(metadata);
          }
          return msg;
        })
      ),
    }),
  ],
});

module.exports = logger;
