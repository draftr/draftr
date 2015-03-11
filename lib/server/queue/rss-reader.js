var crypto     = require('crypto'),
    Promise    = require('bluebird'),
    Article    = require('../model/article'),
    Feed       = require('../model/feed'),
    draftr     = require('../draftr'),
    readFeed   = require('../utility/read-feed');

module.exports = function rssReader(job, done) {
  'use strict';

  function queue(article, feedId) {
    return new Promise(function (resolve, reject) {
      var url      = article.url,
          cacheKey = crypto.createHash('md5').update(url).digest('hex'),
          cache;

      if ((cache = draftr.cache.get(cacheKey)) && cache.imported) {
        return;
      }

      Article.findOne({ url: article.url }, function (err, result) {
        if (err) {
          return reject(err);
        }

        if (result) {
          return resolve({ queued: false, article: article, feedId: feedId });
        }
        article.feedId = feedId;

        draftr.queue
          .create('article-reader', article)
          .priority('medium')
          .save()
        ;

        resolve({ queued: true, article: article, feedId: feedId });
      });
    });
  }

  function finish() {
    job.log('RSS Reader job finished');

    setTimeout(function () {
      draftr.queue
        .create('rss-reader', {})
        .priority('high')
        .save()
      ;
    }, 2 * 60 * 1000); // 2m

    done();
  }

  job.log('Try to load necessary feed data using the mongoose model');
  Feed.findReadable(job.data.url)
    .then(function (data) {
      job.log(data.length + ' updatable feeds found');

      if (data.length === 0) {
        return;
      }

      var stack = {};

      data.forEach(function (item) {
        job.log('Try to read data from feed ' + item.url);
        stack[item._id] = readFeed(item.url);
      });

      return Promise.props(stack);
    })
    .then(function (data) {
      var stack = [],
          id, feed, index, article;

      for (id in data) {
        if (!data.hasOwnProperty(id)) {
          continue;
        }

        feed = data[id];

        for (index = 0; index < feed.length; index++) {
          article = feed[index];
          job.log('Queue article ' + article.url + ' from the feed ' + feed.url);
          stack.push(queue(article, id));
        }
      }

      return Promise.all(stack);
    })
    .then(function (result) {
      var stack = [];

      result.forEach(function (item) {
        stack.push(Feed.findAndUpdateLatestFeedReaderCallAt(item.feedId));
      });

      return Promise.all(stack);
    })
    .then(finish)
    .catch(done)
  ;
};