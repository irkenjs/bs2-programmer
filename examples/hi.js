'use strict';

var com = require('serialport');
var bs2 = require('../');
var async = require('async');

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function assertingbrk(stream, cb) {
  console.log('asserting brk');
  stream.set({brk: true}, function(err) {
    console.log('asserted brk');
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

function brk(stream, time, cb){
  console.log('resetting');

  async.series([
    assertingbrk.bind(null, stream),
    function(cbdone){
      setTimeout(cbdone, time);
    },
    clearbrk.bind(null, stream)
  ], function(error, results){
    cb(error, results);
  });
}

function upload(path, done){

  var serialPort = new com.SerialPort(path, {
    baudrate: 9600,
  });


  async.series([
    serialPort.open.bind(serialPort),
    //dtr happenening for free on port open as long as we brk under ~12ms
    // function(cbdone){
    //   setTimeout(cbdone, 12);
    // },
    brk.bind(null, serialPort, 20),
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
