module.exports = function (req, res) {
  'use strict';

  res.api(200, null, req.user);
};