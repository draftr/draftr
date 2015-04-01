/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    schema, Article;

schema = new Schema({
  url: { type: String, unique: true },
  title: String,
  body: String,
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

Article = mongoose.model('Article', schema, 'article');

module.exports = Article;