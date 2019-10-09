const Sequelize = require('sequelize');
const webController = require('@src/webController');
const { default: { StockInfo }, sequelize } = require('@src/model/model');
const { delay } = require('@src/utils/tools');
const { hasLock, delLock, addLock } = require('@src/locks');
const Op = Sequelize.Op;
const LogHandler = require('@src/utils/LogHandler');

/* ************************************
 * 获取历史K线数据(历史数据)
 * ***********************************/

(async function() {
  const stocks = await sequelize.query(`
    select a.uuid from stockinfos a
    left join stockdata b
      on a.uuid=b.uuid
      where b.uuid is null
        and asset=0
        and status>0
        and security in (0, 14, 16, 29, 30)
  `, {
    type: sequelize.QueryTypes.SELECT,
  })
  sequelize.close();

  const logHandler = new LogHandler(stocks.length, {
    auto: true,
    successHandle: (self, name) => self.logger.info('获取数据, 表示: %s', name),
  });
  if(logHandler.total === 0) {
    logHandler.logger.error('码表数据不存在');
    return;
  }

  webController(exec => {
    async function loop(index) {
      const uuid = stocks[index].uuid;
      const dataType = 13;
      const actionName = `${uuid}-${dataType}`
      addLock(`${actionName}`)
      logHandler.funcS(actionName);
      exec(`
        var reqList = [{ symbol: '${uuid}', dataType: ${dataType}, length: 1000000, order: '' }];
        reqList.forEach(req => gv('reqFlag')[gv('tools').packageActionName(req)] = true);
        gv('socketer').emit(reqList);
      `);
      while(!hasLock(`${actionName}-ok`)) await delay(0.5);
      delLock(`${actionName}-ok`)
      delLock(`${actionName}`)
      if(index + 1 < stocks.length) {
        loop(index + 1);
      } else {
        process.exit();
      }
    }
    loop(0);
  });
})();

