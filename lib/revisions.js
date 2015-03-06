'use strict';

var when = require('when');
var bindCallback = require('when/node').bindCallback;

module.exports = {
  bs2: {
    challenge: new Buffer([0x42, 0x53, 0x32]), 
    response: new Buffer([0xBE, 0xAD, 0xCE]),
    version: new Buffer([0x00]),
    lookup: function(response, cb){
      return bindCallback(when.promise(function(resolve, reject) {
        //TODO need to turn hex 10 into 1.0
        return resolve({name: 'BS2', version: '1.0'});
      }, cb));
    }
  },
  bs2e:
  {
    version: new Buffer([0x65]),
    lookup: function(response, cb){

      return bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x65:
          return resolve({name: 'BS2e', version: '1.0'});

          default:
          return reject(new Error('Unknown: ', response));
        }
      }, cb));
    }
  },
  bs2sx:
  {
    version: new Buffer([0x58]),
    lookup: function(response, cb){
      return bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x58:
          return resolve({name: 'BS2sx', version: '1.0'});

          case 0x59:
          return resolve({name: 'BS2sx', version: '1.1'});

          case 0x60:
          return resolve({name: 'BS2sx', version: '1.2'});

          default:
          return reject(new Error('Unknown: ', response));
        }
      }, cb));
    }
  },
  bs2p:
  {
    version: new Buffer([0x50]),
    lookup: function(response, cb){
      return bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x70:
          return resolve({name: 'BS2p24', version: '1.0'});

          case 0x71:
          return resolve({name: 'BS2p24', version: '1.1'});

          case 0x72:
          return resolve({name: 'BS2p24', version: '1.2'});

          case 0x73:
          return resolve({name: 'BS2p24', version: '1.3'});

          case 0x50:
          return resolve({name: 'BS2p40', version: '1.0'});

          case 0x51:
          return resolve({name: 'BS2p40', version: '1.1'});

          case 0x52:
          return resolve({name: 'BS2p40', version: '1.2'});

          case 0x53:
          return resolve({name: 'BS2p40', version: '1.3'});

          default:
          return reject(new Error('Unknown: ', response));
        }
      }, cb));
    }
  },
  bs2pe:
  {
    version: new Buffer([0x49]),
    lookup: function(response, cb){
      return bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x69:
          return resolve({name: 'BS2pe24', version: '1.0'});

          case 0x70:
          return resolve({name: 'BS2pe24', version: '1.1'});

          case 0x71:
          return resolve({name: 'BS2pe24', version: '1.2'});

          case 0x49:
          return resolve({name: 'BS2pe40', version: '1.0'});

          case 0x50:
          return resolve({name: 'BS2pe40', version: '1.1'});

          case 0x51:
          return resolve({name: 'BS2pe40', version: '1.2'});

          default:
          return reject(new Error('Unknown: ', response));
        }
      }, cb));
    }
  },
};
