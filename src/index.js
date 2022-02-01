const express = require('express');
const exitHook = require('async-exit-hook');
const { Counter } = require('prom-client');

const { middleware: loggingMiddleware, logger } = require('./utils/logging');
const { consumeResources } = require('./resourceConsumer');
const config = require('./utils/config');
const metrics = require('./utils/metrics');

const requestCounter = new Counter({
  name: 'app_request_count_total',
  help: 'Total number of requests.',
  labelNames: ['pod_id', 'endpoint', 'service'],
});

const consumer = consumeResources(
  config.burningResource.responseTime,
  config.burningResource.failureRate,
  config.burningResource.memoryLeak,
);

const main = async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(loggingMiddleware);
  app.use((req, _res, next) => {
    requestCounter.inc({
      service: config.metadata.name,
      pod_id: config.metadata.podId,
      endpoint: req.path,
    });

    next();
  });

  app.get('/metrics', metrics);

  app.get('/hello/:name', (req, res) => {
    const name = req.params.name;

    if (!name) {
      return res.status(400).send();
    }

    try {
      consumer.consume();
    } catch (error) {
      logger.error('unexpected error occured');

      return res.status(500).send();
    }

    const greeting = `hello ${name}!`;
    logger.debug('greeting user: ' + greeting);

    return res.send(greeting);
  });

  const port = process.env.PORT || 4000;
  const server = app.listen(port, () => logger.info({ config }, `listening on port ${port}`));

  exitHook(async () => {
    logger.info('app is going down...');

    server.close();
  });
};

main().catch(error => {
  logger.error(error);

  process.exitCode = 1;
});
