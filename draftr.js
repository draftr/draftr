'use strict';

var app = require('./lib/server/dispatch');

app()
  .then(function (server) {
    server.start();
  })
  .catch(function (err) {
    console.error(err, err.stack);
  })
;