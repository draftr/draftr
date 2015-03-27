var Promise          = require('bluebird'),
    Model            = require('../../../model/work-space'),
    WorkSpaceArticle = require('../../../model/work-space-article'),
    ValidationError  = require('../../../error/validation-error'),
    StatusError      = require('../../../error/status-error');

module.exports = function dell(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('articleId').isMongoId();

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
        "users": { "$elemMatch": { "user": user._id, "isOwner": true} }
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
        Model.update(
          { _id: req.params.id},
          {
            $pull: { articles: { article: req.params.articleId } }
          },
          function(err, entitiy) {
            if (err) {
              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!entitiy) {
              return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
            }

            WorkSpaceArticle.findOneAndRemove({ _id: req.params.articleId }, function(err, article) {
              if (err) {
                return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
              }

              if (!article) {
                return res.api(new StatusError(404, 'Cannot find article by id "' + req.params.id + '"', 'not_found'));
              }

              return res.api(200, null, entitiy);
            });
          }
        );
      } else {
        return res.api(400, "Permission denied", "permission_denied");
      }
    })
    .catch(function(err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    })
  ;
};