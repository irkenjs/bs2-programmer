'use strict';

var revisions = require('./lib/revisions');

var most = require('most');
var when = require('when');
var nodefn = require('when/node');

function Programmer(options){
  var self = this;

  var opts = options || {};

  this._transport = opts.transport;

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

Programmer.prototype.challenge = function(options, cb){
  var self = this;

  if(!options.challenge){
    return nodefn.bindCallback(when(0), cb);
  }

  function predicate(index) {
    return index < options.challenge.length;
  }

  function handler(index) {
    return self.send(options.challenge.slice(index, index + 1))
      .timeout(1000)
      .then(function(response){
        if(response !== options.response[index]){
          throw new Error('Incorrect Response: ' + response + '. Board might not be a ' + options.name);
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

Programmer.prototype.identify = function(options, cb){
  var self = this;

  var promise = this.challenge(options)
    .then(function(){
      return self.send(options.version);
    })
    .timeout(1000, new Error(options.name + ' did not respond. Check power, connection, or maybe this is not a ' + options.name))
    .then(options.lookup);

  return nodefn.bindCallback(promise, cb);
};

Programmer.prototype.bootload = function(options, hex, cb){
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

  var promise = self.identify(options)
    .then(upload)
    .then(signoff);

  return nodefn.bindCallback(promise, cb);
};

module.exports = Programmer;
