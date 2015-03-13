var Reader = require('../../../api/reader'),
    model  = require('../../../model/feed');

module.exports = function read(req, res) {
  'use strict';

  var reader;

  reader = new Reader(model, req, res);

  reader.on('pre.fetch', function (qb) {
    qb.populate({
      path: 'articles',
      options: {
        limit: 5
      }
    });
  });

  reader.execute();
};