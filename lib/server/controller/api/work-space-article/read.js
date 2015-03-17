var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, index, item;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  Model.findOne({ _id: req.params.id }, function (err, workSpace){
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!workSpace) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    req.assert('articleId').isMongoId();

    if ((errors = req.validationErrors())) {
      return res.api(200, null, workSpace.articles);
    }

    for (index = 0; index < workSpace.articles.length; index++) {
      item = workSpace.articles[index];

      if (req.params.articleId === ('' + item.article)) {
        return res.api(200, null, item);
      }
    }
  });
};