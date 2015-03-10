var Reader   = require('../../../api/reader'),
    Model    = require('../../../model/feed');

module.exports = function create(req, res) {
  'use strict';

  var feed,
      data = {url: req.body.url};

  feed = new Model(data);

  feed.save(function (err, entity) {
    if (err) {
      res.api(400, null, err);
      console.log(err);
      return err;
    }

    res.api(200, null, entity);

    return entity;
  });
};