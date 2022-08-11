class ResourcesConsumer {
  responseTime;
  cpuRatio;
  cpuTime;
  failureRate;
  failureOverhead;
  memoryLeak;

  data = [];
  requestCounter = 0;
  failureRateHelper = [];

  constructor(responseTime = 100, cpuRatio = 20, failureRate = 0, failureOverhead = 0, memoryLeak = false) {
    this.responseTime = responseTime;
    this.cpuRatio = cpuRatio;
    this.cpuTime = Math.round((responseTime * cpuRatio) / 100);
    this.failureRate = failureRate;
    this.failureOverhead = failureOverhead;
    this.memoryLeak = memoryLeak;

    this.failureRateHelper = Array.from(
      { length: 100 },
      function (_, i) {
        if (this.fails === 0) {
          return false;
        }

        if (100 - i <= this.fails) {
          this.fails--;

          return true;
        }

        if (Math.random() < this.failureRate / 100) {
          this.fails--;

          return true;
        }

        return false;
      },
      { fails: this.failureRate },
    );
  }

  blockCPUByTime(time = 0) {
    const now = new Date().getTime();
    const v = Math.random() * 10;

    const calculations = this.memoryLeak ? this.data : [];
    for (;;) {
      calculations.push(Math.random() * Math.random());

      if (new Date().getTime() > now + time + v) {
        return;
      }
    }
  }

  async doAsyncWork(time = 0) {
    await new Promise(resolve => setTimeout(resolve, time));

    return;
  }

  async consume() {
    this.blockCPUByTime(this.cpuTime);
    await this.doAsyncWork(this.responseTime - this.cpuTime);

    const throwError = this.failureRateHelper[this.requestCounter];

    this.requestCounter++;
    if (this.requestCounter === 100) {
      this.requestCounter = 0;
    }

    if (throwError) {
      this.blockCPUByTime(this.failureOverhead);

      throw new Error();
    }
  }
}

exports.consumeResources = (responseTime, cpuRatio, failureRate, failureOverhead, memoryLeak) => {
  return new ResourcesConsumer(responseTime, cpuRatio, failureRate, failureOverhead, memoryLeak);
};
