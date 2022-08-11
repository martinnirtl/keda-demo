module.exports = {
  metadata: {
    name: process.env.SERVICE_NAME,
    podName: process.env.POD_NAME,
  },
  burningResource: {
    responseTime: parseInt(process.env.RESPONSE_TIME) || 100,
    cpuRatio: parseInt(process.env.CPU_RATIO) || 20,
    failureRate: parseInt(process.env.FAILURE_RATE) || 0,
    failureOverhead: parseInt(process.env.FAILURE_OVERHEAD) || 0,
    memoryLeak: process.env.MEMORY_LEAK === 'enabled' || false,
  },
};
