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

function reset(stream, time, cb){
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

  serialPort.on('open', function(){

    //breaks as low as 13, but 20 for now
    reset(serialPort, 20, function(){

      bs2.bootload(serialPort, hex, function(error){
        if(error){
          console.log(error);
        }

        serialPort.close(function (error) {
          if(error){
            console.log(error);
          }
        });

        done(error);
      });

    });
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
