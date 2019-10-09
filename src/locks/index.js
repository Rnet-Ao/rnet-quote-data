const fs = require('fs');
const path = require('path');

function getfile(filename) {
  return path.resolve(__dirname, filename);
}

module.exports.hasLock = function(name) {
  return fs.existsSync(getfile(`${name}.lock`));
}

module.exports.addLock = function(name) {
  return fs.writeFileSync(getfile(`./${name}.lock`))
}

module.exports.delLock = function(name) {
  return fs.unlinkSync(getfile(`./${name}.lock`));
}

