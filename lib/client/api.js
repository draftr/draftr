define(['jquery', 'bluebird', 'draftr/auth'], function ($, Promise, auth) {
  'use strict';

  function Api(options) {
    this.config = $.extend(true, {
      method: 'GET',
      resource: null,
      data: {},
      headers: {},
      cache: true,
      timeout: 7000
    }, options || {});
  }

  Api.prototype.resource = function resource(value) {
    this.config.resource = value;
    return this;
  };

  Api.prototype.method = function method(value) {
    this.config.method = value.trim().toUpperCase();
    return this;
  };

  Api.prototype.accessToken = function accessToken(value) {
    this.config.accessToken = value;
    return this;
  };

  Api.prototype.data = function data(key, value) {
    this.config.data[key] = value;
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
    var self = this,
        accessToken;

    return new Promise(function (resolve, reject) {
      if ((accessToken = auth.accessToken())) {
        self.data('access_token', accessToken);
      }
console.log($.extend({
        url: '/api/' + self.config.resource
      }, self.config));
      $.ajax($.extend({
        url: '/api/' + self.config.resource
      }, self.config))
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