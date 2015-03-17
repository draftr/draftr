var path = require('path');

module.exports = function (req, res, next) {
  'use strict';
console.log(req.path);
  var extension = path.extname(req.path);

  if (extension) {
    return next();
  }

  res.render('index.html');
};