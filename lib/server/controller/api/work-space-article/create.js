var Model           = require('../../../model/work-space'),
    Article         = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var errors, article;

  req.assert('id').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('url').isURL();
  req.assert('body').isLength(3);

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  article = new Article({
    title: req.body.title,
    body:  req.body.body,
    url:   req.body.url
  });

  article.save(function (err, entity) {
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!entity) {
      return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
    }

    Model.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          articles: {
            article: entity._id,
            isPublished: false
          }
        }
      },
      function(err, data) {
        if (err) {
          return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
        }

        if (!data) {
          return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
        }

        return res.api(201, null, data.toResObject());
      }
    );
  });
};