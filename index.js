'use strict';

var send = require('./lib/sendData');
var async = require('async');

function identifyBS2(stream, cb) {
  // console.log('identifying');

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
    // console.log('identify SUCCESS. Version: ', version);
    return cb(null, version);
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
