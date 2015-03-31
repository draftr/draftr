'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    schema, WorkSpaceArticle;

schema = new Schema({
  title: String,
  body: String,
  updatedAt: { 'type': Date, 'default': Date.now },
  createdAt: { 'type': Date, 'default': Date.now }
});

schema.set('toObject', { getters: true, virtuals: true });

schema.virtual('currentlyActiveEditors').get(function currentlyActiveEditors() {
  return 1337;
});

schema.methods.toResObject = function toResObject() {
  var data = this.toObject();

  delete data._id;
  delete data.__v;

  return data;
};

WorkSpaceArticle = mongoose.model('WorkSpaceArticle', schema, 'work-space-article');

module.exports = WorkSpaceArticle;
