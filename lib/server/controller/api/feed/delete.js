var Promise         = require('bluebird'),
    Feed            = require('../../../model/feed'),
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

  Feed.findOneAndRemove({ _id: req.params.id }, function (err, feed) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!feed) {
      return res.api(new StatusError(404, 'Cannot find feed by id "' + req.params.id + '"', 'not_found'));
    }

    Promise.map(
      feed.articles || [],
      function (id) {
        return new Promise(function (resolve, reject) {
          Article.findOneAndRemove({ _id: id }, function (err) {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      }
    )
      .then(function () {
        res.api(200, null, null);
      })
      .catch(function () {
        res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      })
    ;
  });
};