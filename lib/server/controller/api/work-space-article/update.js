var validator       = require('validator'),
    Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('articleId').isMongoId();
  req.assert('published').notEmpty();

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOne({ _id: req.params.id }, function (err, workSpace) {
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!workSpace) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    function publish(model) {
      model.isPublished = validator.toBoolean(req.body.published);

      workSpace.save(function(err, result) {
        if (err) {
          return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
        }

        if (!result) {
          return res.api(new StatusError(404, 'Cannot find entity by id "' + req.params.id + '"', 'not_found'));
        }

        return res.api(200, null, result.toResObject());
      });
    }

    var index, article;

    for (index = 0; index < workSpace.articles.length; index++) {
      article = workSpace.articles[index];

      if (('' + article) === req.params.articleId) {
        return publish(article);
      }
    }
  });
};