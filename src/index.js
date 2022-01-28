const express = require('express');
const exitHook = require('async-exit-hook');

const logging = require('./logging');

const config = {
  responseTime: parseInt(process.env.CONFIG_RESPONSETIME) || 140,
  failureRateAbsolut: parseInt(process.env.CONFIG_FAILURERATEABS) || 48,
  simulateMemoryLeak: false,
};

const state = {
  requestCounter: 0,
  calculations: [],
};

const blockCpuFor = ms => {
  const now = new Date().getTime();
  const v = Math.random() * 10;

  const calculations = config.simulateMemoryLeak ? state.calculations : [];
  for (;;) {
    calculations.push(Math.random() * Math.random());

    if (new Date().getTime() > now + ms + v) {
      return;
    }
  }
};

const throwError = () => {
  if (state.requestCounter > 100) {
    state.requestCounter = 0;
  }

  if (++state.requestCounter % config.failureRateAbsolut === 0) {
    return true;
  }

  return false;
};

const main = async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(logging);

  app.get('/hello/:name', (req, res) => {
    const name = req.params.name;

    if (!name) {
      return res.status(400).send();
    }

    blockCpuFor(config.responseTime);
    if (throwError()) {
      blockCpuFor(40);
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
