module.exports = class LogHandler {
  /* *******************************
   * 执行一系列异步操作的实例时使用
   * ******************************/
  constructor(total, {
    successHandle = _ => _,
    errorHandle = _ => _,
    callback = _ => _,
    logger,
    auto = false,
  } = {}) {
    this.funcE = this.funcE.bind(this);
    this.funcS = this.funcS.bind(this);
    this.total = total;
    this.success = 0;
    this.error = 0;
    this.successHandle = successHandle;
    this.errorHandle = errorHandle;
    this.callback = callback;
    this.logger = logger || require('./logger')({ name: 'LogHandler' });
    this.auto = auto;
    this.logger.info('共有任务%d条', total);
  }

  calc() {
    if(this.success + this.error === this.total) {
      this.logger.info('所有任务执行完成, 成功: %d条, 失败: %d条', this.success, this.error);
      this.callback(this.logger);
    }
  }

  logging() {
    this.auto && this.logger.info('执行成功, 应执行%d条, 成功%d条, 失败%d条', this.total, this.success, this.error);
  }

  funcS(...params) {
    ++this.success;
    this.logging();
    this.successHandle(this, ...params);
    this.calc();
  }

  funcE(...params) {
    ++this.error;
    this.logging();
    this.errorHandle(this, ...params);
    this.calc();
  }
}
