'use strict';

var send = require('./lib/sendData');
var async = require('async');

function identifyBS2(stream, cb) {

  var bs2Buffer = new Buffer([0x42, 0x53, 0x32]);
  var bs2Response = new Buffer([0xBE, 0xAD, 0xCE]);

  var index = 0;

  async.whilst(
    function () { return index < bs2Buffer.length; },
    function(cbdone){

      // console.log('sending: ', bs2Buffer.slice(index, index + 1));
      send(stream, 1000, bs2Buffer.slice(index, index + 1), function(err, response){
        // console.log('received: ', err, response);
        if(err){ return cbdone(err); }

        if(response !== bs2Response[index++]){
          return cbdone(new Error('Incorrect Response: ', response));
        }

        return cbdone();
      });
    },
    function(err){

      if(err) { return cb(err); }

      send(stream, 1000, new Buffer([0]), function(err, response){

        if(err){ return cb(err); }

        if (typeof response === 'undefined')
        {
          return cb(new Error('No Version Response'));
        }

        return cb(null, response);
      });
  });

}

function bootload(stream, hex, cb){

  async.series([
    identifyBS2.bind(null, stream),
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
