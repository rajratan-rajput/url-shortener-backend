const formatMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

export const logger = {
  info: (message, meta) => console.log(formatMessage("info", message, meta)),
  warn: (message, meta) => console.warn(formatMessage("warn", message, meta)),
  error: (message, meta) => console.error(formatMessage("error", message, meta)),
};
