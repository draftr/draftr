var request    = require('request'),
    Feedparser = require('feedparser'),
    Promise    = require('bluebird');

/**
 * @param  {string} url
 * @return {Promsie}
 */
module.exports = function readFeed(url) {
  'use strict';

  return new Promise(function (resolve, reject) {
    var reader = request(url),
        parser = new Feedparser(),
        data   = [];

    reader.on('error', reject);

    reader.on('response', function (res) {
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      this.pipe(parser);
    });

    parser.on('error', reject);

    parser.on('readable', function () {
      var item;

      while ((item = this.read())) {
        data.push({
          title: item.title,
          author: item.author,
          url: item.link,
          date: item.pubdate
        });
      }
    });

    parser.on('end', function () {
      resolve(data);
    });
  });
};