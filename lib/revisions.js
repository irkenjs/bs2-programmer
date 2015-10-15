'use strict';

var when = require('when');
var nodefn = require('when/node');

module.exports = {
  bs2: {
    name: 'BS2',
    challenge: new Buffer([0x42, 0x53, 0x32]),
    response: new Buffer([0xBE, 0xAD, 0xCE]),
    version: new Buffer([0x00]),
    lookup: function(response, cb){
      return nodefn.bindCallback(when.promise(function(resolve) {

        var version = response.toString('16');

        if(version.length > 1){
          version = version.substring(0, 1).concat('.', version.substring(1));
        }

        return resolve({name: 'BS2', version: version});
      }), cb);
    }
  },
  bs2e: {
    name: 'BS2e',
    version: new Buffer([0x65]),
    lookup: function(response, cb){

      return nodefn.bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x65:
          return resolve({ name: 'BS2e', version: '1.0', slotCount: 8 });
          case 0x66:
          return resolve({ name: 'BS2e', version: '1.1', slotCount: 8 });
          case 0x67:
          return resolve({ name: 'BS2e', version: '1.2', slotCount: 8 });

          default:
          return reject(new Error('Unknown: ' + response.toString(16)));
        }
      }), cb);
    }
  },
  bs2sx: {
    name: 'BS2sx',
    version: new Buffer([0x58]),
    lookup: function(response, cb){
      return nodefn.bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x58:
          return resolve({ name: 'BS2sx', version: '1.0', slotCount: 8 });

          case 0x59:
          return resolve({ name: 'BS2sx', version: '1.1', slotCount: 8 });

          case 0x5a:
          return resolve({ name: 'BS2sx', version: '1.2', slotCount: 8 });

          case 0x5b:
          return resolve({ name: 'BS2sx', version: '1.3', slotCount: 8 });

          default:
          return reject(new Error('Unknown: ' + response.toString(16)));
        }
      }), cb);
    }
  },
  bs2p: {
    name: 'BS2p',
    version: new Buffer([0x50]),
    lookup: function(response, cb){
      return nodefn.bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x70:
          return resolve({name: 'BS2p', version: '1.0', slotCount: 8 });
          case 0x71:
          return resolve({name: 'BS2p', version: '1.1', slotCount: 8 });
          case 0x72:
          return resolve({name: 'BS2p', version: '1.2', slotCount: 8 });
          case 0x73:
          return resolve({name: 'BS2p', version: '1.3', slotCount: 8 });
          case 0x74:
          return resolve({name: 'BS2p', version: '1.4', slotCount: 8 });
          case 0x75:
          return resolve({name: 'BS2p', version: '1.5', slotCount: 8 });
          case 0x76:
          return resolve({name: 'BS2p', version: '1.6', slotCount: 8 });
          case 0x77:
          return resolve({name: 'BS2p', version: '1.7', slotCount: 8 });

          case 0x50:
          return resolve({name: 'BS2p', version: '1.0', slotCount: 8 });
          case 0x51:
          return resolve({name: 'BS2p', version: '1.1', slotCount: 8 });
          case 0x52:
          return resolve({name: 'BS2p', version: '1.2', slotCount: 8 });
          case 0x53:
          return resolve({name: 'BS2p', version: '1.3', slotCount: 8 });
          case 0x54:
          return resolve({name: 'BS2p', version: '1.4', slotCount: 8 });
          case 0x55:
          return resolve({name: 'BS2p', version: '1.5', slotCount: 8 });
          case 0x56:
          return resolve({name: 'BS2p', version: '1.6', slotCount: 8 });
          case 0x57:
          return resolve({name: 'BS2p', version: '1.7', slotCount: 8 });

          default:
          return reject(new Error('Unknown: ' + response.toString(16)));
        }
      }), cb);
    }
  },
  bs2pe: {
    name: 'BS2pe',
    version: new Buffer([0x49]),
    lookup: function(response, cb){
      return nodefn.bindCallback(when.promise(function(resolve, reject) {

        switch(response){
          case 0x69:
          return resolve({name: 'BS2pe', version: '1.0', slotCount: 8 });
          case 0x6a:
          return resolve({name: 'BS2pe', version: '1.1', slotCount: 8 });
          case 0x6b:
          return resolve({name: 'BS2pe', version: '1.2', slotCount: 8 });
          case 0x6c:
          return resolve({name: 'BS2pe', version: '1.3', slotCount: 8 });
          case 0x6d:
          return resolve({name: 'BS2pe', version: '1.4', slotCount: 8 });

          case 0x49:
          return resolve({name: 'BS2pe', version: '1.0', slotCount: 8 });
          case 0x4a:
          return resolve({name: 'BS2pe', version: '1.1', slotCount: 8 });
          case 0x4b:
          return resolve({name: 'BS2pe', version: '1.2', slotCount: 8 });
          case 0x4c:
          return resolve({name: 'BS2pe', version: '1.3', slotCount: 8 });
          case 0x4d:
          return resolve({name: 'BS2pe', version: '1.4', slotCount: 8 });

          default:
          return reject(new Error('Unknown: ' + response.toString(16)));
        }
      }), cb);
    }
  }
};
