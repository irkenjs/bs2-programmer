'use strict';

var send = require('./lib/sendData');
var revisions = require('./lib/revisions');

var async = require('async');

var when = require('when');
var bindCallback = require('when/node').bindCallback;
var nodefn = require('when/node');

// function identify(stream, cb){

//   async.eachSeries(revisions, iterator, cb);

//   //need async
//   for (rev in revisions){
//     identify()
//   }

// }

function challenge(stream, options, cb){
  //if doesnt have a challenge just return
  if(!options.hasOwnProperty('challenge')){
    return cb();
  }
  
  var index = 0;

  async.whilst(
    function () { return index < options.challenge.length; },
    function(cbdone){

      send(stream, 1000, options.challenge.slice(index, index + 1), function(err, response){
        if(err){ return cbdone(err); }

        if(response !== options.response[index++]){
          return cbdone(new Error('Incorrect Response: ', response));
        }

        return cbdone();
      });
    },
    function(err){
      if(err) { return cb(err); }

      return cb();
  });
}

function identifyBS2(stream, options, cb) {
  return bindCallback(when.promise(function(resolve, reject) {

    var lookup = nodefn.lift(options.lookup);

    var ch = nodefn.lift(challenge);

    function version(){
      var d = when.defer();

      send(stream, 1000, options.version, function(err, result){
        if(err){ d.reject(err); }

        return d.resolve(result);
      });

      return d.promise;
    }

    ch(stream, options)
    .then(version)
    .then(lookup)
    //this is really dumb
    .done(
      function(result){
        return resolve(result);
      },
      function(error){
        return reject(error);
      });

  }), cb);
}

function bootload(stream, hex, cb){
  return bindCallback(when.promise(function(resolve, reject) {

    //partially applying deprecated, so then how do you late bind?
    //https://github.com/cujojs/when/issues/313

    //and if I did then how would I get the version through then?
    function upload(version){
      var d = when.defer();

      send(stream, 1000, hex, function(err, result){
        if(err){ d.reject(err); }

        return d.resolve(version);
      });

      return d.promise;
    }

    function signoff(version){
      var d = when.defer();

      stream.write(new Buffer([0]), function(err, result){
        if(err){ d.reject(err); }

        return d.resolve(version);
      });

      return d.promise;
    }

    identifyBS2(stream, revisions.bs2)
    .then(upload)
    .then(signoff)
    //this is really dumb
    .done(
      function(result){
        return resolve(result);
      },
      function(error){
        return reject(error);
      });

  }), cb);
}

module.exports = {
  identifyBS2: identifyBS2,
  bootload: bootload
};
