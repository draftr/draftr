var Feed           = require('../../../model/feed'),
    Article         = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function dell(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Feed.findOneAndRemove({ _id: req.params.id }, function (err, feed) {
    if (err) {
      return res.api(new StatusError(400, 'Invalid data', err));
    }
    if (feed) {
      feed.articles.forEach(function (articleId) {
        Article.findOneAndRemove({ _id: articleId }, function(err, entity) {
          if (err) {
            return res.api(new StatusError(400, 'Invalid id', err));
          }
        });
      });

      return res.api(200, null, {});
    }
  });
};