var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

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
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      article.articles.forEach(function (entity) {
        if (String(entity.article) === req.params.articleId) {
          entity.isPublished = req.body.published;

          article.save(function(err){
            if (err) {
              return res.api(new StatusError(400, 'Invalid data', err));
            }

            return res.api(200, null, article);
          });
        }
      });
    }
  );
};