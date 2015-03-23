/*eslint-disable no-process-exit */
'use strict';

var com = require('serialport');
var when = require('when');
var nodefn = require('when/node');

var bs2 = require('../');

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function upload(path, done){

  var serialPort = new com.SerialPort(path, {
    baudrate: 9600
  }, false);

  function setDtr(){
    return when.promise(function(resolve, reject) {
      serialPort.set({dtr: false, brk: true}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function setBrk(){
    return when.promise(function(resolve, reject) {
      serialPort.set({dtr: true, brk: true}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function clear(){
    return when.promise(function(resolve, reject) {
      serialPort.set({dtr: true, brk: false}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function bootload(){
    return bs2.bootload(serialPort, bs2.revisions.bs2, hex, 1000);
  }

  function close(){
    return when.promise(function(resolve, reject) {

      serialPort.on('error', function(err){
        return reject(err);
      });

      serialPort.on('close', function(){
        return resolve();
      });

      serialPort.close();
    });
  }


  var promise = nodefn.lift(serialPort.open.bind(serialPort))()
  .then(setDtr)
  .delay(2)
  .then(setBrk)
  .delay(45)
  .then(clear)
  .then(bootload)
  .finally(close);

  return nodefn.bindCallback(promise, done);
}

if(process && process.argv && process.argv[2])
{
  upload(process.argv[2], function(error){
    if(error)
    {
      console.log('error ', error);
    }else{
      console.log('success');
    }
    process.exit(0);
  });
}else
{
  console.log('call with a path like /dev/tty.something');
  process.exit(0);
}
