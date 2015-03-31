'use strict';

var revisions = require('./revisions');

var most = require('most');
var when = require('when');
var nodefn = require('when/node');

function Programmer(options){
  var self = this;

  var opts = options || {};

  this._transport = opts.transport;

  if(typeof opts.revision === 'string'){
    var rev = opts.revision.toLowerCase();
    this._revision = revisions[rev];
  } else {
    this._revision = opts.revision;
  }

  this._queue = null;

  this._transport.on('data', function(chunk){
    if(typeof self._queue === 'function'){
      self._queue(chunk);
    }
  });
}

// Static method
Programmer.revisions = revisions;

Programmer.prototype.queueResponse = function(fn){
  this._queue = fn;
};

Programmer.prototype.send = function(data, cb){
  var self = this;

  var responseLength = data.length + 1;

  var promise = when.promise(function(resolve, reject) {

    var buffer = new Buffer(0);
    function onChunk(chunk) {
      buffer = Buffer.concat([buffer, chunk]);
      if (buffer.length > responseLength) {
        // or ignore after
        return reject(new Error('buffer overflow ' + buffer.length + ' > ' + responseLength));
      }
      if (buffer.length === responseLength) {
        resolve(buffer[data.length]);
      }
    }

    self.queueResponse(onChunk);

    self._transport.write(data, function (writeError) {
      if (writeError) {
        return reject(writeError);
      }
    });
  });

  return nodefn.bindCallback(promise, cb);
};

Programmer.prototype.challenge = function(cb){
  var self = this;

  var revision = this._revision;

  if(!revision.challenge){
    return nodefn.bindCallback(when(0), cb);
  }

  function predicate(index) {
    return index < revision.challenge.length;
  }

  function handler(index) {
    return self.send(revision.challenge.slice(index, index + 1))
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

Programmer.prototype.identify = function(cb){
  var self = this;

  var revision = this._revision;

  var promise = this.challenge()
    .then(function(){
      return self.send(revision.version);
    })
    .timeout(1000, new Error(revision.name + ' did not respond. Check power, connection, or maybe this is not a ' + revision.name))
    .then(revision.lookup);

  return nodefn.bindCallback(promise, cb);
};

Programmer.prototype.bootload = function(hex, cb){
  var self = this;

  var pageSize = 18;

  if(!hex || hex.length % pageSize !== 0){
    throw new Error('Data must be in multiples of 18 bytes');
  }

  function predicate(index) {
    return index < hex.length;
  }

  function iterator(index) {
    return self.send(hex.slice(index, index + pageSize))
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

  function signoff(){
    return when.promise(function(resolve, reject) {
      self._transport.write(new Buffer([0]), function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  var promise = self.identify()
    .then(upload)
    .then(signoff);

  return nodefn.bindCallback(promise, cb);
};

module.exports = Programmer;
