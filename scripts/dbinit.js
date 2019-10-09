require('module-alias/register');
const paths = require('../config/paths');
const path = require('path');
const { sequelize, default: models } = require(path.resolve(paths.appSrc, 'model/model'));
const LogHandler = require(path.resolve(paths.appSrc, 'utils/LogHandler'));
const { argv } = process

/* ********************************************************
 * 初始化数据库
 *   命令中带有force表示完全初始化, 如:
 *   命令中带有数据库名时表示初始化对应的数据库
 *   示例:
 *       初始化数据库(原有数据不删除): yarn dbinit
 *       完全初始化数据库(原有数据删除): yarn dbinit force
 *       初始化指定数据库(原有数据不删除): yarn dbinit stockinfo stockdata
 *       完全初始化指定数据库(原有数据删除): yarn dbinit force stockinfo stockdata
 * *******************************************************/

let config = {};
argv.includes('force') && (config.force = true);
const initEach = argv.filter(arg => Object.keys(models).includes(arg));

const logHandler = new LogHandler(initEach.length || 1, {
  callback: _ => sequelize.close(),
  auto: true,
  errorHandle: (name, err) => logHandler.logger.info('对应%s初始化失败', name, err),
});
logHandler.logger.info('数据库初始化程序启动, 配置信息: %s', JSON.stringify(config));

if(initEach.length === 0) {
  logHandler.logger.info('初始化全部数据库, %s', Object.keys(models).join(', '));
  sequelize
    .sync(config)
    .then(_ => logHandler.funcS())
    .catch(err => logHandler.funcE('数据库', err));
} else {
  logHandler.logger.info('初始化指定数据库, %s', initEach.join(', '));
  initEach.forEach(each =>
    models[each]
      .sync(config)
      .then(_ => logHandler.funcS())
      .catch(err => logHandler.funcE(each, err))
  )
}
