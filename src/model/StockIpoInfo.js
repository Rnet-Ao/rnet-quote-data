const Sequelize = require('sequelize');
const stockIpoInfoMap = require('@src/nameMap/stockIpoInfoMap');

/* **************************************************
 * 库名: stockipoinfo
 * 说明: 股票发行信息
 * *************************************************/

module.exports.default = stockIpoInfoMap.reduce((ans, item) => {
  ans[item.en] = { comment: item.cn };
  ans[item.en].type = item.strWid? Sequelize.DataTypes[item.type](item.strWid): Sequelize.DataTypes[item.type];
  item.primaryKey && (ans[item.en].primaryKey = true);
  return ans;
}, {});
