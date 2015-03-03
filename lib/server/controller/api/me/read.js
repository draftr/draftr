module.exports = function (req, res) {
  'use strict';

  require('../../../draftr').queue
    .create('rss-reader', {})
    .priority('high')
    .save()
  ;

  res.api(200, null, req.user);
};