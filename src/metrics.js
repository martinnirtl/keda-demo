const { collectDefaultMetrics, register } = require('prom-client');

collectDefaultMetrics();

module.exports = async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
};