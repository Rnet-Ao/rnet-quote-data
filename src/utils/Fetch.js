const axios = require('axios');


// 请求拦截器
axios.interceptors.request.use(function(config) {
  return config;
}, function(error) {
  return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  return Promise.reject(error);
})

const fetchMethod = (_config) => {
  return new Promise((resolve, reject) => {
    axios(_config)
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error);
      })
  })
};

class FetchApi {
  /* *******
  * 功能: fetch请求封装
  * 实例化后的调用方法:
  *   User.get(searchParams, bodyParams, config)
  *   或 User.fetch('get', searchParams, bodyParams, config)
  * 参数:
  *   searchParams: Object
  *   bodyParams: Object
  * *******/
  constructor(_url, _command) {
    this.config = {
      headers: {}
    };
    this.url = _url;
    if(_command)this.command = _command;
    this.config.headers["Content-Type"] = "application/json";
    this.apis = ['fetch', 'get', 'post', 'delete'];
  }

  fetch(fetchType, searchParams, bodyParams, urlParams, config) {
    if(Boolean(config)){
      config = {...Object.assign(this.config, config)};
    } else {
      config = this.config;
    }
    config.method = fetchType;
    config.url = this.url;
    if(this.command)searchParams.command = this.command;
    if(Boolean(searchParams))config.params = searchParams;
    if(Boolean(bodyParams))config.data = bodyParams;
    if(Boolean(urlParams))config.url = this.url + urlParams;
    console.log(config)
    return fetchMethod(config);
  };

  get(...data) {
    return this.fetch('get', ...data);
  }

  post(...data) {
    return this.fetch('post', ...data);
  }

  delete(...data) {
    return this.fetch('delete', ...data);
  }
}

module.exports = (url, command) => {
  return new FetchApi(url, command);
};
