module.exports = {
  metadata: {
    name: process.env.SERVICE_NAME,
    podName: process.env.POD_NAME,
  },
  burningResource: {
    responseTime: parseInt(process.env.RESPONSE_TIME) || 140,
    failureRate: parseInt(process.env.FAILURE_RATE) || 0,
    memoryLeak: process.env.MEMORY_LEAK === 'enabled' || false,
  },
};
