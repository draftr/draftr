var Promise         = require('bluebird'),
    Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('name').notEmpty().isLength(3, 50);
  req.assert('description').optional().isLength(3, 1000);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  function isAllowed(user) {
    return new Promise(function (resolve, reject) {
      if (true === user.isAllowed('admin')) {
        resolve(true);
      }
      Model.find({ _id: req.params.id, "users": { "$elemMatch": { "user": user._id, isOwner: true } } }, function(err, entity) {
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
      Model.findOneAndUpdate(
        { _id: req.params.id },
        { name: req.body.name, description: req.body.description },
        function(err, entity) {
          if (err) {
            if (util.detectMongoDbDuplicationErrorKey(err)) {
              return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
            }

            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          if (!entity) {
            return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
          }

          return res.api(200, null, entity.toResObject());
        }
      );
    })
    .catch(function(err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    })
  ;
};