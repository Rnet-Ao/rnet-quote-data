const bunyan = require('bunyan');

module.exports = function(config = { name: '' }) {
  return bunyan.createLogger(config);
}
