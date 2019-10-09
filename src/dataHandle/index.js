const klineDataHandle = require('./klineDataHandle');
const rankDataHandle = require('./rankDataHandle');
const { hasLock, delLock, addLock } = require('@src/locks');

const LOCKNAME = 'sql_execing';
let reqData = [];

async function getData(req) {
  if(hasLock(LOCKNAME)) {
    // sql执行中加入缓存
    reqData.push(req);
    return;
  }
  const { dataType, data, symbol } = req;
  const actionName = `${symbol}-${dataType}`
  addLock(LOCKNAME);
  switch(parseInt(dataType)) {
    case 13:
      await klineDataHandle(data, symbol);
      break;
    case 19:
      await rankDataHandle(data, symbol);
      break;
  }
  delLock(LOCKNAME);
  addLock(`${actionName}-ok`);
  if(reqData.length > 0) {
    getData(reqData.shift());
  }
}

module.exports = getData;
