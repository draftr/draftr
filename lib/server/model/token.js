'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    Type     = Schema.Types,
    schema, Token;

schema = new Schema({
  user: { type: Type.ObjectId, ref: 'User', unique: true },
  token: String,
  createdAt: { 'type': Date, 'default': Date.now }
});

schema.set('toObject', { getters: true });

schema.methods.toResObject = function toResObject() {
  var data = this.toObject();

  delete data._id;
  delete data.__v;

  return data;
};

Token = mongoose.model('Token', schema, 'token');

module.exports = Token;