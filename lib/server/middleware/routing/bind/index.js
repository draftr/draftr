/*jslint node: true */
'use strict';

var path = __dirname + '/../../../controller/';

function bind(id) {
  return require(path + id);
}

bind.setPath = function setPath(value) {
  path = value;
};

module.exports = bind;