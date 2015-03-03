'use strict';

var Promise = require('bluebird'),
    draftr     = require('./draftr');

function Server() {
  this.app         = require('./middleware')(this);
  this.http        = null;
}

Server.prototype.start = function start() {
  draftr.logger.info('draftr is running');

  this.http = this.app.listen(draftr.config.port);
  draftr.io    = require('socket.io')(this.http);
};

Server.prototype.stop = function stop() {
  var self = this;

  return new Promise(function (resolve) {
    self.http.close(function () {
      self.http = null;
      resolve(self);
    });
  });
};

module.exports = Server;