var Promise          = require('bluebird'),
    Model            = require('../../../model/work-space'),
    WorkSpaceArticle = require('../../../model/work-space-article'),
    ValidationError  = require('../../../error/validation-error'),
    StatusError      = require('../../../error/status-error'),
    util             = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var errors, article;

  req.assert('id').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('body').isLength(3);

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  function isAllowed(user) {
    return new Promise(function (resolve, reject) {
      if(true == user.isAllowed('admin')) {
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
        article = new WorkSpaceArticle({
          title: req.body.title,
          body:  req.body.body
        });

        article.save(function (err, entity) {
          if (err) {
            if (util.detectMongoDbDuplicationErrorKey(err)) {
              return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
            }

            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          if (!entity) {
            return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
          }

          Model.findOneAndUpdate(
            { _id: req.params.id },
            {
              $push: {
                articles: {
                  article: entity._id,
                  isPublished: false
                }
              }
            },
            function(err, data) {
              if (err) {
                return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
              }

              if (!data) {
                return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
              }

              return res.api(201, null, data.toResObject());
            }
          );
        });
      } else {
        return res.api(400, "Permission denied", "permission_denied");
      }
    })
    .catch(function(err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    })
  ;
};