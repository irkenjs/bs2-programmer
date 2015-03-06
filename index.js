'use strict';

var send = require('./lib/sendData');
var revisions = require('./lib/revisions');

var when = require('when');
var nodefn = require('when/node');

function challenge(stream, options, cb){
  if(!options.hasOwnProperty('challenge')){
    return cb();
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

function identifyBS2(stream, options, cb) {

  function version(){
    return send(stream, 1000, options.version);
  }

  var promise = challenge(stream, options)
  .then(version)
  .then(options.lookup);

  return nodefn.bindCallback(promise, cb);
}

function bootload(stream, hex, cb){

  function upload(version){
    return send(stream, 1000, hex)
    .then(function(response){
      if(response){
        throw new Error('Bad bootload response: ' + response);
      }
      return version;
    });
  }

  function signoff(version){
    return when.promise(function(resolve, reject) {
      stream.write(new Buffer([0]), function(err){
        if(err){ return reject(err); }
        return resolve(version);
      });
    });
  }

  var promise = identifyBS2(stream, revisions.bs2)
  .then(upload)
  .then(signoff);

  return nodefn.bindCallback(promise, cb);
}

module.exports = {
  identifyBS2: identifyBS2,
  bootload: bootload,
  revisions: revisions
};
