'use strict';

var revisions = require('./revisions');

var most = require('most');
var when = require('when');
var nodefn = require('when/node');

function Programmer(options){
  var opts = options || {};

  this._protocol = opts.protocol;

  if(typeof opts.revision === 'string'){
    var rev = opts.revision.toLowerCase();
    this._revision = revisions[rev];
  } else {
    this._revision = opts.revision;
  }

}

// Static method
Programmer.revisions = revisions;

Programmer.prototype.challenge = function(cb){
  var revision = this._revision;
  var protocol = this._protocol;

  if(!revision.challenge){
    return nodefn.bindCallback(when(0), cb);
  }

  function predicate(index) {
    return index < revision.challenge.length;
  }

  function handler(index) {
    return protocol.send(revision.challenge.slice(index, index + 1))
      .timeout(1000)
      .then(function(response){
        if(response !== revision.response[index]){
          throw new Error('Incorrect Response: ' + response + '. Board might not be a ' + revision.name);
        } else {
          return index + 1;
        }
      });
  }

  var promise = most.iterate(handler, 0)
    .takeWhile(predicate)
    .drain();

  return nodefn.bindCallback(promise, cb);
};

//have to call enterprogramming before and exitprogramming after this function
Programmer.prototype.identify = function(cb){
  var revision = this._revision;
  var protocol = this._protocol;

  var promise = this.challenge()
    .then(function(){
      return protocol.send(revision.version);
    })
    .timeout(1000, new Error(revision.name + ' did not respond. Check power, connection, or maybe this is not a ' + revision.name))
    .then(revision.lookup);

  return nodefn.bindCallback(promise, cb);
};

Programmer.prototype.bootload = function(hex, cb){
  var self = this;

  var protocol = this._protocol;

  var pageSize = 18;

  if(!hex || hex.length % pageSize !== 0){
    throw new Error('Data must be in multiples of 18 bytes');
  }

  function predicate(index) {
    return index < hex.length;
  }

  function iterator(index) {
    return protocol.send(hex.slice(index, index + pageSize))
      .timeout(1000)
      .then(function(response){
        if(response){
          throw new Error('Board nacked packet ' + (index / pageSize) + ' with code: ' + response);
        } else {
          return index + pageSize;
        }
      });
  }

  function upload(){
    return most.iterate(iterator, 0)
      .takeWhile(predicate)
      .drain();
  }

  var promise = protocol.enterProgramming()
    .then(function(){
      return self.identify();
    .then(upload)
    .then(function(){
      return protocol.exitProgramming();
    });

  return nodefn.bindCallback(promise, cb);
};

module.exports = Programmer;