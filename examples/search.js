'use strict';

var com = require('serialport');

var when = require('when');

var bs2 = require('../');

var callbacks = require('when/callbacks');
var fn   = require('when/function');
var nodefn = require('when/node');

//id like to lift all of serialport but that seems to break the constructor
// var com = nodefn.liftAll(com);

//replace with lifts when I figure out how that works

// var id = when.lift(bs2.identifyBS2.bind(bs2));
// var id = fn.lift(bs2.identifyBS2.bind(bs2));
// var id = nodefn.lift(bs2.identifyBS2.bind(bs2));
// var id = callbacks.lift(bs2.identifyBS2.bind(bs2));

// var id = function(stream, options){
//   var d = when.defer();

//   bs2.identifyBS2(stream, options, function(err, board){
//     if(err){ return d.reject(err); }

//     return d.resolve(board);
//   });

//   return d.promise;
// };

function open(stream){
  var d = when.defer();

  stream.open(function(err){
    if(err){ return d.reject(err); }

    return d.resolve();
  });

  return d.promise;
}

function set(stream, options){
  var d = when.defer();

  stream.set(options, function(err){
    if(err){ return d.reject(err); }

    return d.resolve();
  });

  return d.promise;
}

function close(stream){
  var d = when.defer();

  stream.on('error', function(err){
    return d.reject(err); 
  });

  stream.on('close', function(){
    return d.resolve();
  });

  stream.close();
  return d.promise;
}

function search(path, done){

  // async series wont work here to my knownledge because its kind of
  // backwards, if error we need to continue to another board
  // if success stop and give result..
  // soo ... infinite promise chain instead? 

  var serialPort = new com.SerialPort(path, {
    baudrate: 9600,
  }, false);

  // cant seem to lift the serialport either
  // var sp = nodefn.liftAll(serialPort);

  var something = identify(serialPort, bs2.revisions.bs2);
  nodefn.bindCallback(something, done);

}
 
function identify(stream, rev){
  return open(stream)
   // return nodefn.call(stream.open.bind(stream))
  .then(reset.bind(null, stream))
  .then(bs2.identifyBS2.bind(null, stream, rev))
  .finally(close.bind(null, stream));
}


function reset(stream){


  // var setBrk = nodefn.lift(stream.set);
  // var clrBrk = nodefn.lift(stream.set)({brk: false});

  // return nodefn.call(stream.set.bind(stream, {brk: true }))
  // return setBrk({brk: false})
  return set(stream, {brk: true})
  .delay(45)
  // .then(clrBrk);

  .then(set.bind(null, stream, {brk: false}));
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
