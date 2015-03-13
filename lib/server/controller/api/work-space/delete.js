var Promise         = require('bluebird'),
    Model           = require('../../../model/work-space'),
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

  Model.findOneAndRemove({ _id: req.params.id }, function(err, workSpace) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!workSpace) {
      return res.api(new StatusError(404, 'Cannot find user by id "' + req.params.id + '"', 'not_found'));
    }

    Promise.map(
      workSpace.articles,
      function (item) {
        return new Promise(function (resolve, reject) {
          Article.findOneAndRemove({ _id: item.article }, function(err) {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      }
    )
      .then(function () {
        return res.api(200, null, null);
      })
      .catch(function () {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      })
    ;
  });
};