const env = require('@src/.env');

module.exports = {
  ...env,
  SERVICE_NAME: '',
  // 数据库操作日志
  DB_LOG: false,
  // 数据库等待时间
  DB_ACQUIRE: 300000,
}
