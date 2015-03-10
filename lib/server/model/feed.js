'use strict';

var mongoose = require('mongoose'),
    Promise  = require('bluebird'),
    Schema   = mongoose.Schema,
    Type     = Schema.Types,
    schema, Feed;

schema = new Schema({
  url: String,
  latestFeedReaderCallAt: Number,
  updatedAt: { 'type': Date, 'default': Date.now },
  createdAt: { 'type': Date, 'default': Date.now }
});

schema.set('toObject', { getters: true });

schema.methods.toResObject = function toResObject() {
  var data = this.toObject();

  delete data._id;
  delete data.__v;

  return data;
};

Feed = mongoose.model('Feed', schema, 'feed');

Feed.findReadable = function findReadable(url) {
  return new Promise(function (resolve, reject) {
    var condition = {},
        query;

    condition.$or = [
      { latestFeedReaderCallAt: { $lte: Date.now() - 60 * 10 } },
      { latestFeedReaderCallAt: null }
    ];

    if (url) {
      condition = { url: url };
    }

    query = Feed
      .find(condition)
    ;

    if (url) {
      query.limit(10);
    }

    query
      .exec(function (err, data) {
        if (err) {
          return reject(err);
        }

        resolve(data);
      })
    ;
  });
};

Feed.findAndUpdateLatestFeedReaderCallAt = function findAndUpdateLatestFeedReaderCallAt(id, timestamp) {
  new Promise(function (resolve, reject) {
    Feed.findByIdAndUpdate(id, { latestFeedReaderCallAt: timestamp || Date.now() }, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = Feed;