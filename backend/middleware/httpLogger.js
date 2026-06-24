import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, error) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}: ${error?.message || "request error"}`;
  },
  customProps: (req) => ({
    requestId: req.id
  })
});

export default httpLogger;
