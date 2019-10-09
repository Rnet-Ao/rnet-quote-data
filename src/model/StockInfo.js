const DataTypes = require('sequelize').DataTypes;

/* **************************************************
 * 库名: stockinfo
 * 说明: 股票基本信息
 * *************************************************/

module.exports.keymap = {
  ccyCode: 'quote_type',
  priceStep: 'change_unit',
  securityType: 'security',
  stockStatus: 'status',
  stockCode: 'stock_code',
  stockName: 'stock_name',
  codeNumber: 'code_number',
}

module.exports.default = {
  quote_type: {
    type: DataTypes.STRING,
    comment: '证券分类',
  },
  digit: {
    type: DataTypes.INTEGER,
    comment: '小数点位数',
  },
  change_unit: {
    type: DataTypes.INTEGER,
    comment: '价格变换单位',
  },
  security: {
    type: DataTypes.INTEGER,
    comment: '证券类型',
  },
  status: {
    type: DataTypes.INTEGER,
    comment: '股票状态',
  },
  subnew: {
    type: DataTypes.INTEGER,
    comment: '次新股标志',
  },
  tradflag: {
    type: DataTypes.INTEGER,
    comment: '融资融券标志',
  },
  unit: {
    type: DataTypes.INTEGER,
    comment: '每手股数',
  },
  stockpysht: {
    type: DataTypes.STRING,
    comment: '股票拼音',
  },
  area: {
    type: DataTypes.STRING,
    comment: '地区',
  },
  industry: {
    type: DataTypes.STRING,
    comment: '行业',
  },
  asset: {
    type: DataTypes.INTEGER,
    comment: '股票类型',
  },
  exchange: {
    type: DataTypes.STRING,
    comment: '交易所',
    allowNull: false,
  },
  code_number: {
    type: DataTypes.INTEGER,
    comment: '股票代码数字存储',
    allowNull: false,
  },
  stock_code: {
    type: DataTypes.STRING,
    comment: '股票代码',
    allowNull: false,
  },
  stock_name: {
    type: DataTypes.STRING,
    comment: '股票名称',
    allowNull: false,
  },
  uuid: {
    type: DataTypes.STRING,
    comment: '股票uuid',
    allowNull: false,
    primaryKey: true,
  }
};

