'use strict';

var send = require('./lib/sendData');
var revisions = require('./lib/revisions');

var when = require('when');
var nodefn = require('when/node');

function challenge(stream, options, cb){
  if(!options.hasOwnProperty('challenge')){
    return nodefn.bindCallback(when(0), cb);
  }

  function unspool(index) {
    return [index, index + 1];
  }

  function predicate(index) {
    return index >= options.challenge.length;
  }

  function handler(index) {
    return send(stream, 1000, options.challenge.slice(index, index + 1))
      .then(function(response){
        if(response !== options.response[index]){
           throw new Error('Incorrect Response: ' + response);
        }
      });
  }

  var promise = when.unfold(unspool, predicate, handler, 0);
  return nodefn.bindCallback(promise, cb);
}

function identify(stream, options, cb) {

  function version(){
    return send(stream, 1000, options.version);
  }

  var promise = challenge(stream, options)
  .then(version)
  .then(options.lookup);

  return nodefn.bindCallback(promise, cb);
}

function bootload(stream, type, hex, cb){
  var pageSize = 18;

  if(!hex || hex.length % pageSize !== 0){
    throw new Error('Data must be in multiples of 18 bytes');
  }

  function unspool(index) {
    return index + pageSize;
  }

  function predicate(index) {
    return index >= hex.length;
  }

  function handler(index) {
    return send(stream, 10000, hex.slice(index, index + pageSize))
      .then(function(response){
        if(response){
          throw new Error('Bad bootload response: ' + response);
        }
      });
  }

  function upload(){
    return when.iterate(unspool, predicate, handler, 0);
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
