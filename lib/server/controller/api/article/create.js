var Reader   = require('../../../api/reader'),
    Model    = require('../../../model/article');

module.exports = function create(req, res) {
  'use strict';

  var article, result,
      data = {};

  data = {
    title: req.body.title,
    body: req.body.body,
    url: req.body.url
  };

  article = new Model(data);

  result = article.save(function (err, article) {
    if (err) {
      res.api(200, null, article);

      return err;
    }

    res.api(200, null, article);

    return article;
  });
};