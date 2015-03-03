'use strict';

var bach = require('bach');
var times = require('lodash.times');

var send = require('./lib/sendData');
var revisions = require('./lib/revisions');

var async = require('async');

// function identify(stream, cb){

//   async.eachSeries(revisions, iterator, cb);

//   //need async
//   for (rev in revisions){
//     identify()
//   }

// }

function challenge(stream, options, cb){
  var fns = times(options.challenge.length, function(index){
    return function(cb){
      send(stream, 1000, options.challenge.slice(index, index + 1), function(err, response){
        if(err){ return cb(err); }

        if(response !== options.response[index++]){
          return cb(new Error('Incorrect Response: ', response));
        }

        return cb();
      });
    }
  });

  bach.series(fns)(cb);
}

function identifyBS2(stream, options, cb) {

  if(options.hasOwnProperty('challenge')){

    challenge(stream, options, function(err){
      if(err){ return cb(err); }

      send(stream, 1000, options.version, function(err, response){
        if(err){ return cb(err); }

        if (typeof response === 'undefined')
        {
          return cb(new Error('No Version Response'));
        }

        options.lookup(response, cb);
      });

    });
  }
}

function bootload(stream, hex, cb){

  async.series([
    identifyBS2.bind(null, stream, revisions.bs2),
    send.bind(null, stream, 1000, hex),
    stream.write.bind(stream, new Buffer([0])),
    ], function(err, results){

      cb(err, results);
  });
}

module.exports = {
  identifyBS2: identifyBS2,
  bootload: bootload
};
