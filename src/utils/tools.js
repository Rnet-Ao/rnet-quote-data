// 延时处理的promise实现, 单位为秒
module.exports.delay = s => new Promise((resolve) => setTimeout(resolve, s * 1000));

module.exports.functor = _ => false;

module.exports.isDefined = d => {
  return d !== null && typeof d !== "undefined";
}

module.exports.isNotDefined = d => {
  return !module.exports.isDefined(d);
}

module.exports.isLegal = (data, type) => {
  /* **************
   * 判断数据是否为合法数据
   * *************/
  if(
      data === undefined
      || data === 'undefined'
      || data === null
      || data === 'null'
      || (data.constructor === Number && isNaN(data))
    ){
      return false
    }
  if(( type === 'Array' || data.constructor === Array) && data.length === 0){
      return false
    }
  if(( type === 'Object' || data.constructor === Object) && Object.keys(data).length === 0){
      return false;
    }
  return true;
}
