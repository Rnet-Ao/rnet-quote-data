const config = require('../config');
const models = require('./index.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('deploy', 'deploy', 'deploy', {
  host: 'localhost',
  dialect: 'postgres',
  logging: config.DB_LOG,
  pool: {
    acquire: config.DB_ACQUIRE,
  }
});

const modelsObj = Object.keys(models).reduce((res, key) => {
  res[key] = sequelize.define(key.toLocaleLowerCase(), models[key].default, {});
  return res;
}, {});

module.exports.default = modelsObj;
module.exports.sequelize = sequelize;
