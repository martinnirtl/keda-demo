const pino = require('pino-http')({
  name: process.env.SERVICE_NAME,
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

module.exports = pino;
