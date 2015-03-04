'use strict';

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

  challenge(stream, options, function(err){
    if(err){ return cb(err); }

    send(stream, 1000, options.version, function(err, response){
      if(err){ return cb(err); }

        options.lookup(response, cb);
    });
  });
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
