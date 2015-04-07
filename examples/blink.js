/*eslint-disable no-process-exit */
'use strict';

var bs2 = require('../');
var SerialPort = require('serialport').SerialPort;
var Bs2SerialProtocol = require('bs2-serialport');

var hex = new Buffer([0xfe, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x14, 0x20, 0x8c, 0x0e, 0xd8, 0xc8, 0x7c, 0xff, 0x0e, 0x60, 0x4a, 0xae, 0xe8, 0x9f, 0x49, 0xc1, 0x50, 0xc3, 0x6f, 0x8d, 0xd1, 0x03, 0x07, 0xc0, 0x60]);

function bootload(path, done){

  var serial = new SerialPort(path, { baudRate: 9600 }, false);
  serial.open(function(){
    var protocol = new Bs2SerialProtocol({ transport: serial });

    var bs2Options = {
      protocol: protocol,
      revision: 'bs2'
    };

    return bs2.bootload(hex, bs2Options, done);
  });
}

if(process && process.argv && process.argv[2]){
  bootload(process.argv[2], function(error){
    if(error){
      console.log(error);
    } else {
      console.log('success');
    }
    process.exit(0);
  });
} else {
  console.log('call with a path like /dev/tty.something');
  process.exit(0);
}
