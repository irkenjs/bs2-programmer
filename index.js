'use strict';

var send = require('./lib/sendData');
var async = require('async');

function assertingdtr(stream, cb) {
  console.log('asserting dtr, asserting brk');
  stream.set({dtr: true, brk: true}, function(err) {
    console.log('asserted dtr, asserted brk');
    cb(err);
  });
}

function cleardtr(stream, cb) {
  console.log('clearing dtr');
  stream.set({dtr: false}, function(err) {
    console.log('cleared dtr');
    cb(err);
  });
}

function clearbrk(stream, cb) {
  console.log('clearing brk');
  stream.set({brk:false}, function(err) {
    console.log('reset complete');
    cb(err);
  });
}

function reset(stream, time, cb){
  console.log('resetting');

  async.series([
    assertingdtr.bind(null, stream),
    function(cbdone){
      setTimeout(cbdone, 20);
    },
    cleardtr.bind(null, stream),
    function(cbdone){
      setTimeout(cbdone, time);
    },
    clearbrk.bind(null, stream),
    function(cbdone){
      setTimeout(cbdone, 20);
    },
  ], function(error, results){
    cb(error, results);
  });
}

function identifyBS2(stream, cb) {
  console.log('identifying');

  async.series([

    function(cbdone){
      send(stream, 1000, new Buffer([66]), function(err, response){
        if(err){
          return cbdone(err);
        }

        if(response !== 190){
          return cbdone(new Error('Incorrect Response: ', response));
        }

        return cbdone();
      });
    },

    function(cbdone){
      send(stream, 1000, new Buffer([83]), function(err, response){
        if(err){
          return cbdone(err);
        }
        if(response !== 173){
          return cbdone(new Error('Incorrect Response: ', response));
        }

        return cbdone();
      });
    },

    function(cbdone){
      send(stream, 1000, new Buffer([50]), function(err, response){
        if(err){
          return cbdone(err);
        }
        if(response !==206){
          return cbdone(new Error('Incorrect Response: ', response));
        }

        return cbdone();
      });
    },

    function(cbdone){
      send(stream, 1000, new Buffer([0]), function(err, response){
        if(err){
          return cbdone(err);
        }

        return cbdone(null, response);
      });
    },

    // stream.write.bind(stream, new Buffer([66])),
    // function(cbdone){
    //  setTimeout(cbdone, 20);
    // },
    // stream.write.bind(stream, new Buffer([83])),
    // function(cbdone){
    //  setTimeout(cbdone, 20);
    // },
    // stream.write.bind(stream, new Buffer([50])),
    // function(cbdone){
    //  setTimeout(cbdone, 20);
    // },
    // stream.write.bind(stream, new Buffer([0])),
    // function(cbdone){
    //  setTimeout(cbdone, 20);
    // },


    // stream.write.bind(stream, new Buffer([101])),
    // function(cbdone){
    //  setTimeout(cbdone, 5000);
    // },


    // stream.write.bind(stream, new Buffer([88])),
    // function(cbdone){
    //  setTimeout(cbdone, 5000);
    // },

    // stream.write.bind(stream, new Buffer([80])),
    // function(cbdone){
    //  setTimeout(cbdone, 5000);
    // },


    // stream.write.bind(stream, new Buffer([73])),
    // function(cbdone){
    //  setTimeout(cbdone, 5000);
    // },

  ], function(err, results){
    if(err)
    {
      return cb(err);
    }

    if (results.length <= 0)
    {
      return cb(new Error('No Version Response'));
    }

    var version = results[results.length-1];
    console.log('identify SUCCESS. Version: ', version);
    return cb(null, version);
  });

}

function bootload(stream, time, hex, cb){
  async.series([
    reset.bind(null, stream, time),
    identifyBS2.bind(null, stream),
    send.bind(null, stream, 1000, hex),
    stream.write.bind(stream, new Buffer([0])),

    ], function(err, results){

      cb(err, results);

  });
}

module.exports = {
  reset:reset,
  identifyBS2: identifyBS2,
  bootload: bootload
};
