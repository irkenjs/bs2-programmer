'use strict';

var com = require('serialport');
var bs2 = require('../');
var async = require('async');

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function upload(path, done){

  var serialPort = new com.SerialPort(path, {
    baudrate: 200,
  }, false);

  async.series([
    serialPort.open.bind(serialPort),
    // dtr happenening for free on port open as long as we brk under ~12ms
    //wait a bunch to prove we're actually resetting
    function(cbdone){
      setTimeout(cbdone, 5000);
    },
    //interesting fact, we currently have to dtr false to generate a reset
    serialPort.set.bind(serialPort, {dtr: false}),
    function(cbdone){
      setTimeout(cbdone, 2);
    },
    serialPort.set.bind(serialPort, {dtr: true}),
    serialPort.write.bind(serialPort, new Buffer([0x00])),
    // Need to stay about a 70ms blocking delay here for byte to clear before
    // we're safe to switch baud
    function(cbdone){
      setTimeout(cbdone, 100);
    },
    serialPort.update.bind(serialPort, {baudRate: 9600}),
    bs2.bootload.bind(null, serialPort, hex)

  ], function(error, results){

    serialPort.close(function (error) {
      if(error){
        console.log(error);
      }
    });

    console.log(error, results);
    done(error, results);
  });

}

if(process && process.argv && process.argv[2])
{
  upload(process.argv[2], function(error){
    if(!error)
    {
      console.log('programing SUCCESS!');
      process.exit(0);
    }
  });
}else
{
  console.log('call with a path like /dev/tty.something');
  process.exit(0);
}
