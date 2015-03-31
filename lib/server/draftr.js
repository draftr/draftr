'use strict';

var draftr    = {},
    mongoose  = require('mongoose'),
    Promise   = require('bluebird'),
    kue       = require('kue'),
    Cache     = require('node-cache'),
    io        = require('socket.io'),
    logger    = require('./logger');

function setUp(config) {
  return new Promise(function (resolve) {
    draftr.config = config;

    draftr.env    = process.env.NODE_ENV;
    draftr.logger = logger(draftr.env);

    // initailize cache
    draftr.cache = new Cache({ checkperiod: 120 });

    draftr.logger.info('Setup complete');
    resolve();
  });
}

function setUpQueue() {
  // create simple message queue
  draftr.queue = kue.createQueue();

  // register queue processors
  draftr.queue.process('rss-reader', 5, require('./queue/rss-reader'));
  draftr.queue.process('article-reader', 10, require('./queue/article-reader'));

  // register events to get the necessary information
  draftr.queue.on('job enqueue', function (id, name) {
    draftr.logger.info('Job ' + id + ' (' + name + ') got queued');
  });

  draftr.queue.on('job complete', function (id) {
    draftr.logger.info('Job ' + id + ' completed');
  });

  draftr.queue.on('job failed', function (id, err) {
    draftr.logger.error('Job ' + id + ' complete', err);
  });

  draftr.logger.info('RSS Reader queued');

  draftr.queue
    .create('rss-reader', {})
    .priority('high')
    .save()
  ;

  return Promise.resolve();
}

function openDatabase() {
  return new Promise(function (resolve, reject) {
    var isOpened = false;

    draftr.logger.info('Connect to database', draftr.config.db.sets);

    draftr.db = mongoose.connect(draftr.config.db.sets.join(','), draftr.config.db.options);

    draftr.db.connection.once('open', function () {
      isOpened = true;

      draftr.logger.info('Database opened');
      resolve();
    });

    draftr.db.connection.once('error', function (err) {
      if (isOpened) {
        return draftr.logger.error(err);
      }

      reject();
    });

    draftr.db.connection.on('error', draftr.logger.error);
  });
}

function initSocketIo() {
  draftr.io = io();
  draftr.logger.info('socket.io initialized');

  return Promise.resolve();
}

function init(config) {
  return setUp(config)
    .then(openDatabase)
    .then(setUpQueue)
    .then(initSocketIo)
    .catch(function (error) {
      draftr.logger.error(error.message, error.stack);
    })
  ;
}

module.exports      = draftr;
module.exports.init = init;