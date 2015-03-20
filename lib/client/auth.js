define(['jquery', 'store', 'bluebird', 'event-emitter'], function ($, store, Promise, EventEmitter) {
  'use strict';

  var ee          = new EventEmitter(),
      key         = 'accessToken',
      currentUser = null,
      auth;

  function empty() {}

  function request(method, url, data, callback) {
    method = (method || 'get').toUpperCase();
    data   = $.extend({ 'access_token': auth.accessToken() }, data);

    return $.ajax({
      method: method,
      url: url,
      data: data
    })
      .done(function (res) {
        callback(null, res);
      })
      .fail(function (xhr) {
        var res, err;
        try {
          res      = JSON.parse(xhr.responseText);
          err      = new Error(res.meta.error.message);
          err.info = res.meta.error;

          callback(err, null);
        } catch (e) {
          return callback(new Error('Cannot parse response'), null);
        }
      })
    ;
  }

  auth = {
    user: function user(callback) {
      ee.on('user', callback);

      if (null === currentUser || currentUser.isAuthenticated) {
        if (this.accessToken() === null) {
          currentUser = { isAuthenticated: false };
          ee.emit('user', currentUser);

          return this;
        }

        request('GET', '/api/me', {}, function (err, res) {
          if (err) {
            return ee.emit('user', { isAuthenticated: false });
          }

          currentUser                 = res.data;
          currentUser.isAuthenticated = true;

          ee.emit('user', currentUser);
        });
      } else {
        callback(currentUser);
      }

      return this;
    },
    signIn: function signIn(username, password, callback) {
      var self = this;

      request('POST', '/api/sign-in', { username: username, password: password }, function (err, res) {
        if (err) {
          return callback(err, null);
        }

        store.set(key, res.data.accessToken);

        currentUser.isAuthenticated = true;
        self.user(empty);

        callback(null, res.data);
      });
    },
    signOut: function signOut() {
      currentUser = { isAuthenticated: false };
      store.remove(key);

      ee.emit('user', currentUser);

      return this;
    },
    accessToken: function accessToken() {
      return store.get(key, null);
    }
  };

  return auth;
});