'use strict';

var draftr   = require('../draftr'),
    registry = {};

draftr.io.on('connection', function (socket) {
  socket.on('write start', function (info) {
    registry[info.articleId] = registry[info.articleId] || [];
    registry[info.articleId].push(info.userId);

    socket.broadcast.emit('write new-user', info);
    console.log(registry);
  });
});