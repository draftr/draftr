var Model           = require('../../../model/work-space'),
    Article         = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var errors, article;

  req.assert('id').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('url').isURL();
  req.assert('body').isLength(3);

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  article = new Article({
    title: req.body.title,
    body: req.body.body,
    url: req.body.url
  });

  article.save(function (err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Duplicate key', err));
    }

    Model.findOneAndUpdate(
      { _id: req.params.id },
      { $push:
        {
        articles:
          {
            article: entity._id,
            isPublished: false
          }
        }
      },
      function(err, data) {
        if (err) {
          return res.api(new StatusError(400, 'Invalid data', err));
        }

        return res.api(200, null, data.toResObject());
      }
    );
  });
};