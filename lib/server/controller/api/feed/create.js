var Reader   = require('../../../api/reader'),
    Model    = require('../../../model/feed');

module.exports = function create(req, res) {
  'use strict';

  var feed,
      data = {url: req.body.url,};

  data = {
    title: req.body.title,
    body: req.body.body,
    url: req.body.url
  };

  feed = new Model(data);

  feed.save(function (err, feed) {
    if (err) {
      res.api(200, null, feed);

      return err;
    }

    res.api(200, null, feed);

    return feed;
  });
};