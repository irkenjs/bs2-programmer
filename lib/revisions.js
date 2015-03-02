'use strict';

module.exports = {
  bs2: {
    challenge: new Buffer([0x42, 0x53, 0x32]), 
    response: new Buffer([0xBE, 0xAD, 0xCE]),
    version: new Buffer([0x00]),
    lookup: function(response, cb){

      //TODO need to turn hex 10 into 1.0
      return cb(null, {name: 'BS2', version: '1.0'});
    }
  },
  bs2e:
  {
    version: new Buffer([0x65]),
    lookup: function(response, cb){

      switch(response){
        case 0x65:
        return cb(null, {name: 'BS2e', version: '1.0'});

        default:
        return cb(new Error('Unknown: ', response));
      }
    }
  },
  bs2sx:
  {
    version: new Buffer([0x58]),
    lookup: function(response, cb){

      switch(response){
        case 0x58:
        return cb(null, {name: 'BS2sx', version: '1.0'});

        case 0x59:
        return cb(null, {name: 'BS2sx', version: '1.1'});

        case 0x60:
        return cb(null, {name: 'BS2sx', version: '1.2'});

        default:
        return cb(new Error('Unknown: ', response));
      }
    }
  },
  bs2p:
  {
    version: new Buffer([0x50]),
    lookup: function(response, cb){

      switch(response){
        case 0x70:
        return cb(null, {name: 'BS2p24', version: '1.0'});

        case 0x71:
        return cb(null, {name: 'BS2p24', version: '1.1'});

        case 0x72:
        return cb(null, {name: 'BS2p24', version: '1.2'});

        case 0x73:
        return cb(null, {name: 'BS2p24', version: '1.3'});

        case 0x50:
        return cb(null, {name: 'BS2p40', version: '1.0'});

        case 0x51:
        return cb(null, {name: 'BS2p40', version: '1.1'});

        case 0x52:
        return cb(null, {name: 'BS2p40', version: '1.2'});

        case 0x53:
        return cb(null, {name: 'BS2p40', version: '1.3'});

        default:
        return cb(new Error('Unknown: ', response));
      }
    }
  },
  bs2pe:
  {
    version: new Buffer([0x49]),
    lookup: function(response, cb){

      switch(response){
        case 0x69:
        return cb(null, {name: 'BS2pe24', version: '1.0'});

        case 0x70:
        return cb(null, {name: 'BS2pe24', version: '1.1'});

        case 0x71:
        return cb(null, {name: 'BS2pe24', version: '1.2'});

        case 0x49:
        return cb(null, {name: 'BS2pe40', version: '1.0'});

        case 0x50:
        return cb(null, {name: 'BS2pe40', version: '1.1'});

        case 0x51:
        return cb(null, {name: 'BS2pe40', version: '1.2'});

        default:
        return cb(new Error('Unknown: ', response));
      }
    }
  },
};
