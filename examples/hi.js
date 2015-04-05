/*eslint-disable no-process-exit */
'use strict';

var bs2 = require('../');
var Bs2Transport = require('bs2-serialport');

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function bootload(path, done){

  var protocolOpts = {
    path: path
  };

  var transport = new Bs2Transport(protocolOpts);

  var bs2Options = {
    transport: transport,
    revision: 'bs2'
  };

  return bs2.bootload(hex, bs2Options, done);
}

if(process && process.argv && process.argv[2])
{
  bootload(process.argv[2], function(error){
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
