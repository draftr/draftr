/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    gravatar = require('gravatar'),
    schema, User;

schema = new Schema({
  username: { type: String, unique: true },
  emailAddress: { type: String, unique: true },
  password: String,
  allowed: [
    {
      right: String
    }
  ],
  image: String,
  updatedAt: { 'type': Date, 'default': Date.now },
  createdAt: { 'type': Date, 'default': Date.now }
});

schema.pre('validate', function initGravatarImage(next) {
  this.image = gravatar.url(this.emailAddress);
  console.log(this.image);
  next();
});

schema.set('toObject', { getters: true, virtuals: true });

schema.methods.isAllowed = function isAllowed(right) {
  var index;

  for (index = 0; index < this.allowed.length; index++) {
    if (right === this.allowed[index].right) {
      return true;
    }
  }

  return false;
};

schema.methods.toResObject = function toResObject() {
  var data = this.toObject();

  delete data._id;
  delete data.__v;
  delete data.password;

  return data;
};

User = mongoose.model('User', schema, 'user');

module.exports = User;