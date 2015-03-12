var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error');

module.exports = function read(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  Model.findOne({ _id: req.params.id}, function (err, workSpace){
    if (err) {
      return res.api(new ValidationError(400, 'Invalid data', errors));
    }

    req.assert('articleId').isMongoId();

    errors = req.validationErrors();

    if (errors) {
      return res.api(200, null, workSpace.articles);
    }

    workSpace.articles.forEach(function (article) {
      if (req.params.articleId === String(article.article)) {
        return res.api(200, null, article);
      }
    });
  });
}