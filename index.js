'use strict';

var Programmer = require('./lib/programmer');

function identify(options, cb){
  var programmer = new Programmer(options);

  return programmer.identify(cb);
}

function challenge(options, cb){
  var programmer = new Programmer(options);

  return programmer.challenge(cb);
}

function bootload(options, hex, cb){
  var programmer = new Programmer(options);

  return programmer.bootload(hex, cb);
}

module.exports = {
  identify: identify,
  challenge: challenge,
  bootload: bootload,
  revisions: Programmer.revisions,
  Programmer: Programmer
};
