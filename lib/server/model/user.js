'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    Type     = Schema.Types,
    schema, User;

schema = new Schema({
  _id: Type.ObjectId,
  nickname: { type: String, unique: true },
  emailAddress: { type: String, unique: true },
  password: String,
  token: String,
  updatedAt: { 'type': Date, 'default': Date.now },
  createdAt: { 'type': Date, 'default': Date.now }
});

schema.set('toObject', { getters: true });

schema.methods.toResObject = function toResObject() {
  var data = this.toObject();

  delete data._id;
  delete data.__v;
  delete data.password;

  return data;
};

User = mongoose.model('User', schema, 'user');

module.exports = User;