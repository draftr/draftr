var Model           = require('../../../model/work-space'),
    Article         = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function dell(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('articleId').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.update(
    { _id: req.params.id},
    {
      $pull: { articles: {article: req.params.articleId} }
    },
    function(err, entitiy) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      Article.findOneAndRemove({ _id: req.params.articleId }, function(err, article) {
        if (err) {
          return res.api(new StatusError(400, 'Invalid Article id', err));
        }

        if (!article) {
          return res.api(new StatusError(400, 'Invalid Article id', req.params.id));
        }

        return res.api(200, null, null);
      });
    });
};