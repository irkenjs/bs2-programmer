'use strict';

var when = require('when');
var nodefn = require('when/node');

function Protocol(){
  this._data = new Buffer(0);
  this._index = 0;
}

// mock specific
Protocol.prototype._setData = function(data){
  this._data = data;
};

Protocol.prototype.enterProgramming = function(cb){
  var promise = when.resolve();

  return nodefn.bindCallback(promise, cb);
};

Protocol.prototype.exitProgramming = function(cb){
  var promise = when.resolve();

  return nodefn.bindCallback(promise, cb);
};

Protocol.prototype.send = function(data, cb){
  var defer = when.defer();

  if(this._index < this._data.length){
    var response = this._data[this._index++];
    defer.resolve(response);
  }

  return nodefn.bindCallback(defer.promise, cb);
};

Protocol.prototype.reset = function(cb){
  var promise = when.resolve();

  return nodefn.bindCallback(promise, cb);
};

Protocol.prototype.signoff = function(cb){
  var promise = when.resolve();

  return nodefn.bindCallback(promise, cb);
};

module.exports = Protocol;
