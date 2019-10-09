const { codelistByGZ } = require('@src/utils/Resource');
const pako = require('pako');
const { default: { StockInfo }, sequelize } = require('@src/model/model');
const { keymap } = require('@src/model/StockInfo');
const LogHandler = require('@src/utils/LogHandler');

/* ************************************
 * 获取股票基本信息数据(码表数据)
 * ***********************************/

module.exports = function getCodeList() {
  codelistByGZ.get().then(data => {
    data = JSON.parse(pako.ungzip(data, { to: 'string' } ));
    if(data.length === 0)return;
    const logHandler = new LogHandler(data.length, {
      callback: _ => sequelize.close(),
      auto: true,
      errorHandle: (self, item, err) => self.logger.info('%s数据写入失败', JSON.stringify(item), err),
    });
    data.forEach(item => {
      const ans = Object.keys(item).reduce((res, key) => (res[keymap[key] || key] = item[key], res), {});
      StockInfo.create(ans)
        .then(_ => logHandler.funcS())
        .catch(err => logHandler.funcE(ans, err))
    });
  });
}
