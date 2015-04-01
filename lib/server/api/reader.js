/*jslint node: true */
'use strict';

var _            = require('underscore'),
    StatusError  = require('../error/status-error'),
    EventEmitter = require('events').EventEmitter,
    inherit      = require('util').inherits;

function definition(req, config) {
 return {
  id: req.params[config.primaryKey] ? req.params[config.primaryKey] : null,
  limit: parseInt(req.params[config.qs.limit] || config.standard.limit, 10),
  page: parseInt(req.params[config.qs.page] || config.standard.page, 10),
  orderBy: req.params[config.qs.orderBy] || config.standard.orderBy,
  orderDirection: req.params[config.qs.orderDirection] || config.standard.orderDirection
 };
}

function Reader(model, req, res, config) {
  EventEmitter.call(this);

  this.model  = model;
  this.req    = req;
  this.res    = res;
  this.config = _.deepExtend({
    primaryKey: 'id',
    qs: {
      limit: 'limit',
      page: 'page',
      orderBy: 'orderBy',
      orderDirection: 'orderDirection'
    },
    standard: {
      limit: 10,
      page: 1,
      orderBy: null,
      orderDirection: null
    },
    hide: [],
    isAllowed: []
  }, config || {});
}

inherit(Reader, EventEmitter);

// (1) query
// (2) pre.fetch
// (3) post.fetch
// (4) pre.send
// (5) post.send
Reader.prototype.execute = function() {
  var spec  = definition(this.req, this.config),
      self  = this,
      one   = null !== spec.id,
      qb, result, index, statusError, right, isAccessGranted;

  function raiseForbidden() {
    statusError = new StatusError(403, 'Forbidden to use this resource', 'forbidden');
    self.emit('pre.send', statusError, null);
    self.res.api(statusError);
    self.emit('post.send', statusError, null);
  }

  // authenticate the current request and check the user rights
  if (this.config.isAllowed && this.config.isAllowed.length > 0) {
    for (index = 0; index < this.config.isAllowed.length; index++) {
      right = this.config.isAllowed[index];

      if (typeof right === 'function') {
        isAccessGranted = right(spec, self);
      } else {
        isAccessGranted = this.req.user.isAllowed(right);
      }

      if (!isAccessGranted) {
        return raiseForbidden();
      }
    }
  }

  if (one) {
    self.req.checkParams('id').isMongoId();

    if (self.req.validationErrors()) {
      statusError = new StatusError(400, 'Invalid id obtained', 'invalid_id');
      self.emit('pre.send', statusError, null);
      self.res.api(statusError);
      self.emit('post.send', statusError, null);

      return;
    }

    qb = self.model.findOne({
      _id: spec.id
    });
  } else {
    qb = self.model.find({});
  }

  self.emit('query', qb);

  if (!one) {
    qb
      .limit(spec.limit)
    ;

    if (spec.orderBy && spec.orderDirection) {
      qb
        .sort(
          ((spec.orderDirection === 'asc') ? '' : '-') +
          spec.orderBy
        )
      ;
    }
  }

  self.emit('pre.fetch', qb);
  qb.exec(function (err, data) {
    self.emit('post.fetch', err, data);

    if (err) {
      statusError = new StatusError(500, err.message, 'internal_error');
      self.emit('pre.send', statusError, data);
      self.res.api(statusError);
      self.emit('post.send', statusError, data);

      return;
    }

    if (Array.isArray(data) && data.length === 0) {
      data = null;
    }

    if (one && null === data) {
      return self.res.api(new StatusError(404, 'Not Found', 'not_found'));
    }

    function prepare(item) {
      if (self.config.hide && self.config.hide.length > 0) {
        self.config.hide.forEach(function (key) {
          delete item[key];
        });
      }

      return item;
    }

    if (one) {
      result = prepare(data.toResObject());
    } else {
      result = [];
      for (index = 0; index < (data || []).length; index++) {
        result[index] = prepare(data[index].toResObject());
      }
    }

    if (null === data) {
      result = null;
    }

    self.emit('pre.send', result);
    self.res.api(200, null, result);
    self.emit('post.send', result);
  });
};

module.exports = Reader;