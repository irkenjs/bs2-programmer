'use strict';
var nodefn = require('when/node');

var Programmer = require('./lib/programmer');

function identify(options, cb){
  var programmer = new Programmer(options);

  var version;

  var promise = programmer.enterProgramming()
    .then(programmer.identify.bind(programmer))
    .then(function(e){
      version = e;
    })
    .then(programmer.exitProgramming.bind(programmer))
    .finally(function(e){
      if(e instanceof 'Error'){
        return e;
      }

      return version;
    });

  return nodefn.bindCallback(promise, cb);
}

function bootload(hex, options, cb){
  var programmer = new Programmer(options);

  var _bootload = function(){
    return programmer.bootload(hex);
  };

  var promise = programmer.enterProgramming()
    .then(_bootload)
    .then(function(){
      //hack because bootload is returning something which is being used as a callback in exit
    })
    .then(programmer.exitProgramming.bind(programmer));

  return nodefn.bindCallback(promise, cb);
}

module.exports = {
  identify: identify,
  bootload: bootload,
  revisions: Programmer.revisions,
  Programmer: Programmer
};
