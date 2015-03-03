var draftr = require('../draftr');

module.exports = function logger(req, res, next) {
  'use strict';

  var start = process.hrtime();

  res.on('finish', function () {
    var total = process.hrtime(start),
        elapsed = parseFloat(total[0] + (total[1] / 1000000).toFixed(2), 10);

    draftr.logger.info(req.method + ' - ' + req.originalUrl + (' ('+ elapsed +'ms)'), {
      type: 'request',
      method: req.method,
      originalUrl: req.originalUrl,
      duration: elapsed
    });
  });

  next();
};