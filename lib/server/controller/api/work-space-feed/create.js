var validator       = require('validator'),
    Model           = require('../../../model/work-space'),
    Feed            = require('../../../model/feed'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  function updateWorkSpace(feed) {
    Model.findOneAndUpdate(
      { _id: req.params.id },
      { $push:
        {
        feeds:
          feed._id
        }
      },
      function(err, entity) {
        if (err) {
          if (util.detectMongoDbDuplicationErrorKey(err)) {
            return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
          }

          return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
        }

        return res.api(200, null, entity.toResObject());
      }
    );
  }
  req.assert('url').isURL();
  req.assert('feedId').isMongoId();

  errors = req.validationErrors();
  console.log(errors);
  return res.api(200, null, errors);
  if (!errors) {
    Feed.findOne( { _id: req.params.feedId }, function (err, feed){
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if(!feed) {
        return res.api(new StatusError(404, 'Cannot find Feed by id "' + req.params.id + '"', 'not_found'));
      }

      return updateWorkSpace(feed);
    });
  }
  errors = null;

  req.assert('url').isURL();

  errors = req.validationErrors();
  if (!errors) {
    Feed.findOne( { url: req.body.url }, function (err, feed){
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!feed) {
        var newFeed = new Feed({
          url: req.body.url
        });

        newFeed.save(function (err, entity) {
          if (err) {
            if (util.detectMongoDbDuplicationErrorKey(err)) {
              return res.api(new StatusError(400, 'Duplicate key', err));
            }

            return res.api(new StatusError(500, 'Internal Server Error'));
          }

          return updateWorkSpace(entity);
        });
      }
      if (feed) {
        return updateWorkSpace(feed);
      }
    });
  }
};