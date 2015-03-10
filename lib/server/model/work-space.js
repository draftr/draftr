'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    Type     = Schema.Types,
    schema, WorkSpace;

schema = new Schema({
  name: { type: String, unique: true },
  users: [
    {
      user: { type: Type.ObjectId, ref: 'User' },
      isModerator: Boolean,
      isOwner: Boolean
    }
  ],
  feeds: [
    { type: Type.ObjectId, ref: 'Feed' }
  ],
  articles: [
    {
      article: { type: Type.ObjectId, ref: 'Article' },
      isPublished: Boolean
    }
  ],
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

WorkSpace = mongoose.model('WorkSpace', schema, 'work-space');

module.exports = WorkSpace;