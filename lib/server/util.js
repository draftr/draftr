'use strict';

module.exports = {
  detectMongoDbDuplicationErrorKey: function (err) {
    var matched = /\$(.*?)_/.exec(err.message);

    if (err.name === 'MongoError' && matched && matched[1]) {
      return matched[1];
    }

    return false;
  }
};