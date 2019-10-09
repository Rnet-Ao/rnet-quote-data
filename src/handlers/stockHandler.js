const { stockInfo } = require('@src/utils/Resource');
const cheerio = require('cheerio');
const stockIpoInfoMap = require('@src/nameMap/stockIpoInfoMap');
const { default: { StockIpoInfo, StockInfo }, sequelize } = require('@src/model/model');
const LogHandler = require('@src/utils/LogHandler');
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { isDefined, isNotDefined, functor, isLegal } = require('@src/utils/tools');

function getAndWriteData(uuid, {
  okFunc=functor,
  failFunc=functor,
  index=0,
} = {}) {
  /* *********************************
   * 爬取html页面并解析数据入库
   * ********************************/
  stockInfo.get(null, null, `${uuid}.html`).then(res => {
    try {
      const $ = cheerio.load(res);
      const ansList = $('.box').text().replace(/ /g, '').split('\n').filter(_ => _ !== '');
      if(ansList.length === 0 || res.includes('暂时没有该公司数据')) {
        // 暂时没有该公司数据页面处理
        failFunc(`${uuid}暂时没有该公司数据`);
        return;
      }
      let key, val, findItem, data = {}, preFindItem;
      ansList.forEach(each => {
        if(!['公司资料', '发行上市'].includes(each)) {
          findItem = stockIpoInfoMap.find(item => {
            const ind = each.indexOf(item.cn);
            if(ind === 0) {
              if(item.cn.length === each.length) {
                return true;
              } else if(['(', ' ', '（'].includes(each[item.cn.length])) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          });
          if(findItem) {
            if(key && isDefined(val)) {
              // 写入
              data[key] = val;
            }
            val = '';
            key = findItem.en;
          } else {
            if(typeof val === 'number') throw new Error('数据异常, 请核查!');
            if(['FLOAT', 'INTEGER', 'BIGINT'].includes(preFindItem.type)) {
              each = parseFloat(each);
              if(each && typeof(each) === 'number' && isLegal(each)) {
                preFindItem.unit && (each = Math.round(each * preFindItem.unit));
                val = each;
              } else {
                val = null;
              }
            } else if(preFindItem.type === 'DATE') {
              val = dayjs(each).toDate();
            } else {
              val += each;
            }
          }
          if(findItem) {
            preFindItem = findItem;
          }
        }
      })
      data[key] = val;
      okFunc(data);
    } catch(err) {
      throw new Error('codeExecError');
    }
  }).catch(err => {
    if(err.message === 'codeExecError') {
      failFunc(`${uuid}请求成功但解析失败`);
    } else if(index >= 5) {
      failFunc(`${uuid}请求5次失败`);
    } else {
      getAndWriteData(uuid, {
        okFunc,
        failFunc,
        index: index + 1,
      })
    }
  });
}

module.exports = async function getStockInfo() {
  /* *********************************
   * 获取Ipo信息数据
   * ********************************/
  const stocks = await StockInfo.findAll({
    attributes: ['exchange', 'stock_code'],
    where: {
      asset: 0,
      security: {
        [Op.or]: [0, 14, 16, 29, 30]
      }
    }
  });

  const logHandler = new LogHandler(stocks.length, {
    auto: true,
    successHandle: (self, name) => self.logger.info('写入数据成功, 标识: %s', name),
    errorHandle: (self, name) => self.logger.error('写入数据失败, 标识: %s', name),
    callback: _ => sequelize.close(),
  });
  if(logHandler.total === 0) {
    logHandler.logger.error('库StockInfo里未找到指定数据');
    return;
  }

  stocks.forEach(item => {
    const uuid = `${item.exchange}${item.stock_code}`;
    getAndWriteData(uuid, {
      okFunc: data => {
        StockIpoInfo.create(data)
          .then(_ => logHandler.funcS(uuid))
          .catch(err => {
            logHandler.funcE(uuid);
            console.log(err);
            console.log(JSON.stringify(data, false, 2));
          });
      },
      failFunc: logHandler.funcE,
    });
  });
};
