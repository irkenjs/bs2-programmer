/*eslint-disable no-process-exit */
'use strict';

var com = require('serialport');
var when = require('when');
var nodefn = require('when/node');

var bs2 = require('../');

// tries all revisions against the board
// async series wont work here to my knownledge because its kind of
// backwards, if error we need to continue to another board
// if success stop and give result..
// soo ... infinite promise chain instead? or bach?

function identify(stream, rev){

  function setDtr(){
    return when.promise(function(resolve, reject) {
      stream.set({dtr: false, brk: true}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function setBrk(){
    return when.promise(function(resolve, reject) {
      stream.set({dtr: true, brk: true}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function clear(){
    return when.promise(function(resolve, reject) {
      stream.set({dtr: true, brk: false}, function(err){
        if(err){ return reject(err); }
        return resolve();
      });
    });
  }

  function id(){
    return bs2.identify(stream, rev);
  }

  function close(){
    return when.promise(function(resolve, reject) {

      stream.on('error', function(err){
        return reject(err);
      });

      stream.on('close', function(){
        return resolve();
      });

      stream.close();
    });
  }

  return nodefn.lift(stream.open.bind(stream))()
  .then(setDtr)
  .delay(2)
  .then(setBrk)
  .delay(45)
  .then(clear)
  .then(id)
  .finally(close);
}

function search(path, done){

  var serialPort = new com.SerialPort(path, {
    baudrate: 9600
  }, false);

  var promise = identify(serialPort, bs2.revisions.bs2);
  return nodefn.bindCallback(promise, done);

}

if(process && process.argv && process.argv[2])
{
  search(process.argv[2], function(error, board){
    if(error)
    {
      console.log('error ', error);
    }else{
      console.log('found ', board);
    }
    process.exit(0);
  });
}else
{
  console.log('call with a path like /dev/tty.something');
  process.exit(0);
}
