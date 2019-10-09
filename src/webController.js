const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
const logger = require('@src/utils/logger')({ name: 'server' })
const { DATA_RECEIVE, TARGET_URL } = require('@src/config');

/* ************************************
 * 启动可以操控的浏览器程序, 并导入数据
 * ***********************************/

function launchChrome(headless=true) {
  logger.info('%s方式启动chrome', headless? '无头': '有头');
  return chromeLauncher.launch({
    chromeFlags: [
      '--window-size=1680,960',
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  });
}

module.exports = async function(func) {
  const chrome = await launchChrome(true);
  const protocol = await CDP({port: chrome.port});
  const {Page, Runtime, Network} = protocol;
  await Promise.all([Page.enable(), Runtime.enable(), Network.enable()]);
  Page.navigate({url: TARGET_URL});
  function exec(jsCode) {
    return Runtime.evaluate({ expression: jsCode });
  }

  Page.loadEventFired(async () => {
    exec(`
      const gv = name => window.globalVarible.getGV(name);
      const sv = (key, val) => window.globalVarible.setGV(key, val);
      sv('reqFlag', {});
      var req = gv('fetchResource')('${DATA_RECEIVE}');
      sv('handleFunc', (data, monitor) => {
        const actionName = monitor.actionName;
        if(gv('reqFlag')[actionName]) {
          const [symbol, dataType] = gv('tools').resolveActionName(actionName);
          gv('reqFlag')[actionName] = false;
          req.post(null, { data, dataType, symbol })
            .then(_ => {
              gv('socketer').unemit(actionName);
            })
        }
      })
    `);
    setTimeout(_ => {
      logger.info('页面加载完成执行回调!');
      func(exec);
    }, 5000);
  });
};
