const _config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ||
    [],
} as const;

const config = Object.freeze(_config);

export default config;
