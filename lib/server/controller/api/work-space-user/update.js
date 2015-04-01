var Promise         = require('bluebird'),
    Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util'),
    validator       = require('validator');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('userId').isMongoId();
  req.assert('isModerator').notEmpty();
  req.assert('isAdmin').notEmpty();

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
        "users": { "$elemMatch": { "user": user._id, "isAdmin": true} }
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

  function updateUser(user) {
    for (var i = 0; i < user.users.length; i++) {
      if (("" + user.users[i].user) === req.params.userId) {
        user.users[i].isModerator = validator.toBoolean(req.body.isModerator);
        user.users[i].isAdmin     = validator.toBoolean(req.body.isAdmin);

        user.save(function(err, user){
          if (err) {
            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          return res.api(200, null, user);
        });
      }
    }
  }

  isAllowed(req.user)
    .then(function (allowed) {
      if (true === allowed) {
        Model.findOne({ _id: req.params.id, "users": { "$elemMatch": { "user": req.params.userId } }}, function(err, user) {
            if (err) {
              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!user) {
              return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
            }

            updateUser(user);
          }
        );
      } else {
        return res.api(400, "Permission denied", "permission_denied");
      }
    })
    .catch(function(err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    })
};