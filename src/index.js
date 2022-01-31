const express = require('express');
const exitHook = require('async-exit-hook');

const logging = require('./logging');
const metrics = require('./metrics');
const { useProblem } = require('./problems');

const config = {
  responseTime: parseInt(process.env.RESPONSE_TIME) || 140,
  failureRate: parseInt(process.env.FAILURE_RATE) || 0,
  memoryLeak: process.env.MEMORY_LEAK === 'enabled' || false,
};

const problem = useProblem(config.responseTime, config.failureRate, config.memoryLeak);

const main = async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(logging);

  app.get('/metrics', metrics);

  app.get('/hello/:name', (req, res) => {
    const name = req.params.name;

    if (!name) {
      return res.status(400).send();
    }

    try {
      problem.do();
    } catch (error) {
      return res.status(500).send();
    }

    const greeting = `hello ${name}!`;
    logging.logger.debug('greeting user: ' + greeting);

    return res.send(greeting);
  });

  const port = process.env.PORT || 4000;
  const server = app.listen(port, () => logging.logger.info({ config }, `listening on port ${port}`));

  exitHook(async () => {
    logging.logger.info('app is going down...');

    server.close();
  });
};

main().catch(error => {
  logging.logger.error(error);

  process.exitCode = 1;
});
