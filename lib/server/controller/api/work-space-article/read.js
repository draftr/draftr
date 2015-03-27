var Promise          = require('bluebird'),
    validator        = require('validator'),
    Model            = require('../../../model/work-space'),
    WorkSpaceArticle = require('../../../model/work-space-article'),
    ValidationError  = require('../../../error/validation-error'),
    StatusError      = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, isArticleId;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  isArticleId = validator.isMongoId(req.params.articleId);

  Model.findOne({_id: req.params.id }).populate({
    path: 'articles.article',
    model: WorkSpaceArticle
  })
  .exec(function(err, result) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!result) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    if (true === isArticleId) {
      var index;
      for (index = 0; index < result.articles.length; index++) {
        if (("" + result.articles[index].article._id) === req.params.articleId) {
          return res.api(200, null, result.articles[index]);
        }
      }

      return res.api(400, "Not found", {});
    } else {
      return res.api(200, null, result.articles);
    }
  });

}