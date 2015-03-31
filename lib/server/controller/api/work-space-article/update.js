var Promise          = require('bluebird'),
    validator        = require('validator'),
    Model            = require('../../../model/work-space'),
    WorkSpaceArticle = require('../../../model/work-space-article'),
    ValidationError  = require('../../../error/validation-error'),
    StatusError      = require('../../../error/status-error'),
    util             = require('../../../util');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('articleId').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('body').isLength(3);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  function isAllowed(user) {
    return new Promise(function (resolve, reject) {
      if (true === user.isAllowed('admin')) {
        resolve(true);
      }
      Model.findOne(
      {
        _id: req.params.id,
        "users": { "$elemMatch": { "user": user._id, "isModerator": true} }
      }, function(err, entity) {

        if (err) {
         return reject(err);
        }
        if (entity) {
          resolve(true);
        }

        reject(false);
      });
    });
  }

  isAllowed(req.user)
    .then(function (allowed) {
      if (true === allowed) {
        WorkSpaceArticle.findOneAndUpdate(
          { _id: req.params.articleId },
          {
            title: req.body.title,
            body: req.body.body
          },
          function(err, entity) {
            if (err) {
              if (util.detectMongoDbDuplicationErrorKey(err)) {
                return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
              }
              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!entity) {
              return res.api(new StatusError(404, 'Cannot find article by id "' + req.params.id + '"', 'not_found'));
            }

            return res.api(200, null, entity.toResObject());
          }
        );
      } else {
        return res.api(400, "Permission denied", "permission_denied");
      }
    })
    .catch(function(err) {
      return res.api(400, "Permission denied", "permission_denied");
    })
  ;
};