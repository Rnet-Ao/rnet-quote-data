const Sequelize = require('sequelize');

/* **************************************************
 * 库名: stockdata
 * 说明: 历史K线数据
 * *************************************************/

module.exports.keymap = {
  netChangeRatio: 'net_change_ratio',
  netChange: 'net_change',
  preClose: 'pre_close',
}

module.exports.default = {
  uuid: {
    type: Sequelize.STRING,
    comment: '股票uuid',
    allowNull: false,
    primaryKey: true,
  },
  datetime: {
    type: Sequelize.DataTypes.DATE,
    comment: '日期时间',
    primaryKey: true,
    allowNull: false,
  },
  open: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '开盘价',
  },
  high: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '最高价',
  },
  low: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '最低价',
  },
  close: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '收盘价',
  },
  volume: {
    type: Sequelize.DataTypes.BIGINT,
    comment: '成交量',
  },
  amount: {
    type: Sequelize.DataTypes.BIGINT,
    comment: '成交额',
  },
  net_change_ratio: {
    type: Sequelize.DataTypes.FLOAT,
    comment: '涨跌幅',
  },
  net_change: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '涨跌',
  },
  pre_close: {
    type: Sequelize.DataTypes.INTEGER,
    comment: '昨收价',
  },
};

