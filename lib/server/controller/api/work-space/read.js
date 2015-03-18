var Reader   = require('../../../api/reader'),
    Model    = require('../../../model/work-space');

module.exports = function read(req, res) {
  'use strict';

  var reader;

  reader = new Reader(Model, req, res);

  reader.on('pre.fetch', function (qb) {
    qb.where({ "users": { "$elemMatch": { "user": req.user.id } } });

    qb
      .populate({
        path: 'articles',
        options: {
          limit: 5
        }
      })
      .populate('users.user')
    ;
  });

  reader.execute();
};