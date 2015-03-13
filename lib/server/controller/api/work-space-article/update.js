var Model           = require('../../../model/work-space'),
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

  Model.findOne({ _id: req.params.id }, function(err, article) {
      if (err) {
        if (util.detectMongoDbDuplicationErrorKey(err)) {
          return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
        }

        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!article) {
        return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
      }

      article.articles.forEach(function (entity) {
        if (String(entity.article) === req.params.articleId) {
          entity.isPublished = req.body.published;

          article.save(function(err, data){
            if (err) {
              if (util.detectMongoDbDuplicationErrorKey(err)) {
                return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
              }

              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!entity) {
              return res.api(new StatusError(404, 'Cannot find Article by id "' + req.params.id + '"', 'not_found'));
            }

            return res.api(200, null, entity);
          });
        }
      });
    }
  );
};