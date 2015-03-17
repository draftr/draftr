var validator       = require('validator'),
    WorkSpace       = require('../../../model/work-space'),
    Feed            = require('../../../model/feed'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var errors, isValidUrl, isValidFeedId;

  // workspace identifier
  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  isValidUrl    = validator.isURL(req.body.url);
  isValidFeedId = validator.isMongoId(req.body.feedId);

  if (isValidUrl && !isValidFeedId) {
    Feed.findOne({ url:req.body.url }, function (err, feed) {
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!feed) {
        var newFeed = new Feed({
          url: req.body.url
        });

        newFeed.save(function (err, entity) {
          if (err) {
            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          WorkSpace.findOneAndUpdate({ _id: req.params.id },{ $push: { feeds: entity._id }}, function(err, data) {
            if (err) {
              if (util.detectMongoDbDuplicationErrorKey(err)) {
                return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
              }

              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!data) {
              return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
            }

            return res.api(201, null, data.toResObject());
          });
        });
      } else {
        WorkSpace.findOne({ _id: req.params.id, feeds: feed._id }, function (err, item) {
          if (err) {
            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          if (item) {
            return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
          }

          WorkSpace.findOneAndUpdate({ _id: req.params.id },{ $push: { feeds: feed._id } }, function (err, data) {
            if (err) {
              if (util.detectMongoDbDuplicationErrorKey(err)) {
                return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
              }

              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!data) {
              return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
            }

            return res.api(201, null, data.toResObject());
          });
        });
      }
    });
  }

  if (!isValidUrl && isValidFeedId) {
    WorkSpace.findOne( { _id: req.params.id, feeds: req.body.feedId }, function (err, item) {
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (item) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      WorkSpace.findOneAndUpdate({ _id: req.params.id },{ $push: { feeds: req.body.feedId }}, function(err, data) {
        if (err) {
          return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
        }

        if (!data) {
          return res.api(new StatusError(404, 'Cannot find workspace by id "' + req.params.id + '"', 'not_found'));
        }

        return res.api(201, null, data.toResObject());
      });
    });
  }

  if (isValidUrl && isValidFeedId) {
    return res.api(new ValidationError(400, 'Invalid data Feed id or Url', 'invalid_data'));
  }

  if (!isValidUrl && !isValidFeedId) {
    return res.api(new ValidationError(400, 'Invalid data', 'invalid_data'));
  }
};