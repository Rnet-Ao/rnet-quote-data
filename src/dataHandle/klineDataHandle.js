const { default: models, sequelize } = require('@src/model/model');
const { keymap } = require('@src/model/StockData');
const { StockData } = models;
const dayjs = require('dayjs');
const logger = require('@src/utils/logger')({ name: 'dataHandle' })

module.exports = function(data, symbol) {
  return new Promise((resolve, reject) => {
    sequelize.transaction(t => {
      let promises = [];
      for(let i = 0; i < data.length; i++) {
        let obj = Object.keys(data[i]).reduce((res, key) => (res[keymap[key] || key] = data[i][key], res), { uuid: symbol });
        obj.datetime = dayjs(`${data[i].date}${String(data[i].time).length === 8? '0': ''}${data[i].time}`, 'YYYYMMDDHHmmssSSS');
        promises.push(StockData.create(obj, { transaction: t }));
      }
      return Promise.all(promises)
    }).then(ans => {
      logger.info('%s数据写入成功, 共写入数据条数: %d', symbol, data.length);
      resolve('success');
    }).catch(err => {
      logger.error('%s数据写入失败: %o', symbol, err);
      resolve('success');
    })
  });
}
