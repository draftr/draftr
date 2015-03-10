var Model           = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var article, errors;

  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('url').isURL();
  req.assert('body').isLength(3);

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  article = new Model({
    title: req.body.title,
    body: req.body.body,
    url: req.body.url
  });

  article.save(function (err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Duplicate key', err));
    }

    return res.api(200, null, entity.toResObject());
  });
};