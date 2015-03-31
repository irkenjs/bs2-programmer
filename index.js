'use strict';

var send = require('./lib/sendData');
var revisions = require('./lib/revisions');

var most = require('most');
var when = require('when');
var nodefn = require('when/node');

var TimeoutError = require('./lib/timeouterror.js');

function challenge(stream, options, cb){
  if(!options.hasOwnProperty('challenge')){
    return nodefn.bindCallback(when(0), cb);
  }

  function predicate(index) {
    return index < options.challenge.length;
  }

  function handler(index) {
    return send(stream, 1000, options.challenge.slice(index, index + 1))
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
}

function identify(stream, options, cb) {

  function version(){
    return send(stream, 1000, options.version);
  }

  var promise = challenge(stream, options)
  .then(version)
  .then(options.lookup)
  // rewrite timeout errors
  .catch(function(e){
    if(e instanceof TimeoutError)
    {
      throw new Error(options.name + ' did not respond. Check power, connection, or maybe this is not a ' + options.name);
    }
    throw e;
  });

  return nodefn.bindCallback(promise, cb);
}

function bootload(stream, type, hex, timeout, cb){
  var pageSize = 18;

  if(!hex || hex.length % pageSize !== 0){
    throw new Error('Data must be in multiples of 18 bytes');
  }

  function iterator(index) {
    return send(stream, timeout, hex.slice(index, index + pageSize))
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
      .take(hex.length / pageSize)
      .drain();
  }

  function signoff(){
    return when.promise(function(resolve, reject) {
      stream.write(new Buffer([0]), function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  var promise = identify(stream, type)
  .then(upload)
  .then(signoff);

  return nodefn.bindCallback(promise, cb);
}

module.exports = {
  identify: identify,
  bootload: bootload,
  revisions: revisions
};
