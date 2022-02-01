const pino = require('pino-http')({
  base: undefined,
  messageKey: 'content',
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  level: process.env.LOG_LEVEL || 'debug',
  quietReqLogger: true,
});

module.exports = {
  middleware: pino,
  logger: pino.logger,
};
