'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var hardware = function(){
  if (!(this instanceof hardware)){
    return new hardware();
  }

  EventEmitter.call(this);

  this.data = new Buffer(0);
  this.index = 0;
};
util.inherits(hardware, EventEmitter);

hardware.prototype.write = function(data, callback){

  var self = this;
  callback(null, data);

  //echo back and send response character
  process.nextTick(function(){

    self.emit('data', data);

    if(self.index < self.data.length){
      var next = self.data.slice(self.index++, self.index);
      self.emit('data', next);
    }

  });
};

hardware.prototype.setData = function(buffer){

  this.data = buffer;
};

module.exports = hardware;
