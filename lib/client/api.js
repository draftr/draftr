define(['jquery', 'bluebird', 'draftr/auth'], function ($, Promise, auth) {
  'use strict';

  function Api(options) {
    this.config = $.extend(true, {
      method: 'GET',
      resource: null,
      data: {},
      headers: {},
      cache: true,
      timeout: 7000,
      dataType: undefined,
      contentType: undefined,
      processData: undefined,
    }, options || {});
  }

  Api.prototype.dataType = function dataType(value) {
    this.config.dataType = value;
    return this;
  };

  Api.prototype.contentType = function contentType(value) {
    this.config.contentType = value;
    return this;
  };

  Api.prototype.processData = function processData(value) {
    this.config.processData = value;
    return this;
  };

  Api.prototype.resource = function resource(value) {
    this.config.resource = value;
    return this;
  };

  Api.prototype.method = function method(value) {
    value = ('' + value).trim().toUpperCase();

    if (value === 'POST') {
      this
        .processData(false)
        .dataType('json')
        .contentType('application/json')
      ;
    }

    this.config.method = value;
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

      $.ajax($.extend(
        {
          url: '/api/' + self.config.resource,
        },
        self.config,
        {
          data: (self.config.contentType === 'application/json') ?
            JSON.stringify(self.config.data) :
            self.config.data
        }
      ))
        .done(function (res) {
          resolve(res);
        })
        .fail(function (xhr) {
          var res, err;

          try {
            res      = JSON.parse(xhr.responseText);
            err      = new Error(res.meta.error.message);
            err.info = res.meta.error;

            reject(err, res);
          } catch (e) {
            return reject(e, null);
          }
        })
      ;
    });
  };

  return function api(options) {
    return new Api(options);
  };
});