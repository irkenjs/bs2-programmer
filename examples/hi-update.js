/*eslint-disable no-process-exit */
'use strict';

var nodefn = require('when/node');

var bs2 = require('../');
var when = require('when');
var Bs2Protocol = require('bs2-serialport');
var SerialPort = require('serialport').SerialPort;

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function upload(path, done){

  var serialOptions = {
    baudrate: 200
  };

  var serialport = new SerialPort(path, serialOptions, false);

  var protocolOpts = {
    serialport: serialport
  };

  var protocol = new Bs2Protocol(protocolOpts);

  var bs2Options = {
    protocol: protocol,
    revision: 'bs2'
  };

  var open = nodefn.lift(serialport.open.bind(serialport));

  function bootload(){
    console.log('bootload');
    return bs2.bootload(hex, bs2Options);
  }

  function close(){
    return when.promise(function(resolve) {
      serialport.close(function(){
        //always resolve so we dont overwrite previous errors in finally
        return resolve();
      });
    });
  }

  var promise = open()
  .then(protocol.reset.bind(protocol))
  .then(bootload)
  .finally(close);

  return nodefn.bindCallback(promise, done);
}

if(process && process.argv && process.argv[2])
{
  upload(process.argv[2], function(error){
    if(error)
    {
      console.log(error);
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
