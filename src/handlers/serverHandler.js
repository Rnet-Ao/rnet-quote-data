const bodyParser = require('body-parser');
const app = require('express')();
const dataHandle = require('@src/dataHandle/index.js');
const logger = require('@src/utils/logger')({ name: 'server' })

/* ************************************
 * 基于express框架的服务脚本, 用于接收数据
 * ***********************************/

module.exports = function(port = 8888, callback = _ => _) {
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({extended: false}));
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  app.post('/data', (req, res) => {
    logger.info('接收并处理数据, symbol: %s, dataType: %s', req.body.symbol, req.body.dataType);
    dataHandle(req.body);
    res.json({
      status: 'success',
    })
  });

  app.listen(port, _ => {
    logger.info('后端数据监听程序启动, 端口: %d', port);
  });
}
