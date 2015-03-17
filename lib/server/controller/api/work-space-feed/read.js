var Model           = require('../../../model/work-space'),
    Feed            = require('../../../model/feed'),
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

    req.assert('feedId').isMongoId();

    errors = req.validationErrors();

    if (errors) {
      Feed.find({  '_id': { $in: workSpace.feeds }}, function (err, feeds) {
        if (err) {
          return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
        }

        if (!feeds) {
          return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
        }

        return res.api(200, null, feeds);
      });
    }

    if(!errors) {
      for (index = 0; index < workSpace.feeds.length; index++) {
        item = workSpace.feeds[index];

        if (req.params.feedId === ('' + item)) {
          Feed.findOne({ _id: item}, function(err, feed) {
            if (err) {
              return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
            }

            if (!fefeededs) {
              return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
            }

            return res.api(200, null, feed.toResObject());
          })
        }
      }
    }
  });
};