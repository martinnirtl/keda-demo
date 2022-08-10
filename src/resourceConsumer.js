class ResourcesConsumer {
  responseTime;
  failureRate;
  memoryLeak;

  data = [];
  requestCounter = 0;
  failureRateHelper = [];

  constructor(responseTime = 140, failureRate = 0, memoryLeak = false) {
    this.responseTime = responseTime;
    this.failureRate = failureRate;
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

  blockCPUByTime(time = this.responseTime) {
    const now = new Date().getTime();
    const v = Math.random() * 40;

    const calculations = this.memoryLeak ? this.data : [];
    for (;;) {
      calculations.push(Math.random() * Math.random());

      if (new Date().getTime() > now + time + v) {
        return;
      }
    }
  }

  blockCPUByEffort(effort = this.effort) {
    var res = 0;
    for (var i = 0; i < effort; i++) {
      for (var j = 0; j < effort; j++) {
        res = i * i + 1;
      }
    }

    if (res == 0) {
      console.log('common! let me do some work!');
    }

    return;
  }

  consume(effort, computingTime = this.responseTime, errorOverhead = 0) {
    if (effort > 0) {
      this.blockCPUByEffort(effort);
    } else {
      this.blockCPUByTime(computingTime + errorOverhead);
    }

    const throwError = this.failureRateHelper[this.requestCounter];

    this.requestCounter++;
    if (this.requestCounter === 100) {
      this.requestCounter = 0;
    }

    if (throwError) {
      throw new Error();
    }
  }
}

exports.consumeResources = (responseTime, failureRate, memoryLeak) => {
  return new ResourcesConsumer(responseTime, failureRate, memoryLeak);
};
