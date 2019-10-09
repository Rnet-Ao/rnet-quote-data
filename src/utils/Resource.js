const fetchResource = require('@src/utils/Fetch');
const config = require('@src/config');

const API_HOST = config.API_HOST;
const F10_HOST = config.F10_HOST;

module.exports = {
  codelistByGZ: fetchResource(`${API_HOST}/codelistByGZ/ALL`),
  stockInfo: fetchResource(`${F10_HOST}/9_`),
}
