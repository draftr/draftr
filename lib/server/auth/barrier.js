var jwt = require('jsonwebtoken'),
    draftr = require('../draftr');

module.exports = function barrier(req, res, next) {
  'use strict';

  next();

  // var token = req.query.token;

  // jwt.verify(token, draftr.config.token.secret, function (err) {
  //   if (err) {
  //     return res.api(401);
  //   }

  //   next();
  // });
};