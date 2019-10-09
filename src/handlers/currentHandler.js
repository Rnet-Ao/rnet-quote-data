const webController = require('@src/webController');
const { delay } = require('@src/utils/tools');
const { hasLock, delLock, addLock } = require('@src/locks');

/* ************************************
 * 获取当日排行榜数据(实时数据)
 * ***********************************/

(async function() {
  webController(async exec => {
    const uuid = 'AG';
    const dataType = 19;
    const actionName = `${uuid}-${dataType}`
    addLock(`${actionName}`)
    exec(`
      var reqList = [{ symbol: '${uuid}', dataType: ${dataType}, order: "netChangeRatio_desc", start: 0, end: 10000 }];
      reqList.forEach(req => gv('reqFlag')[gv('tools').packageActionName(req)] = true);
      gv('socketer').emit(reqList);
    `);
    while(!hasLock(`${actionName}-ok`)) await delay(1);
    delLock(`${actionName}-ok`)
    delLock(`${actionName}`)
    process.exit();
  });
})();

