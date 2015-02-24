'use strict';

var com = require('serialport');
var bs2 = require('../');

var hex = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

function upload(path, done){

  var serialPort = new com.SerialPort(path, {
    baudrate: 9600,
  });

  serialPort.on('open', function(){

    bs2.bootload(serialPort, 50, hex, function(error){

      serialPort.close(function (error) {
        console.log(error);
      });

      done(error);
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
