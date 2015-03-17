define(['jquery', 'bluebird', 'store'], function ($, Promise, store) {
  'use strict';

  function Api(options) {
    this.config = $.extend(true, {
      method: 'GET',
      resource: null,
      params: {},
      headers: {},
      accessToken: store.get('accessToken') || null,
      cache: true,
      timeout: 7000
    }, options || {});
  }

  Api.prototype.resource = function resource(value) {
    this.config.resource = value;
    return this;
  };

  Api.prototype.method = function method(value) {
    this.config.method = value;
    return this;
  };

  Api.prototype.accessToken = function accessToken(value) {
    this.config.accessToken = value;
    return this;
  };

  Api.prototype.param = function param(key, value) {
    this.config.params[key] = value;
    return this;
  };

  Api.prototype.cache = function cache(value) {
    this.config.cache = value;
    return this;
  };

  Api.prototype.header = function header(key, value) {
    this.config.headers[key] = value;
    return this;
  };

  Api.prototype.timeout = function timeout(value) {
    this.config.timeout = value;
    return this;
  };

  Api.prototype.request = function request() {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.param('access_token', self.config.accessToken);

      $($.extend({ url: '/api/' + self.config.resource }, self.config))
        .done(function (res) {
          resolve(res);
        })
        .fail(function (xhr) {
          reject(JSON.parse(xhr.responseText).meta.error);
        })
      ;
    });
  };

  return function api(options) {
    return new Api(options);
  };
});