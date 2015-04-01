'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var Bs2Protocol = require('bs2-serialport');

var bs2 = require('../');
var hardware = require('../mock/hardware');

var hi = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);

lab.experiment('bs2', function(){

  var serial;
  var protocol;
  var options;

  lab.beforeEach(function(done){
    serial = hardware();
    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10]));
    protocol = new Bs2Protocol({ serialport: serial });
    options = {
      protocol: protocol,
      revision: 'bs2'
    };
    done();
  });

  lab.experiment('challenge', function () {

    lab.test('works without creating a new programmer instance first', function(done){
      bs2.challenge(options, function(err){
        Code.expect(err).to.not.exist();
        done();
      });
    });

    lab.test('supports the promise pattern', function(done){
      bs2.challenge(options)
        .then(function(){
          done();
        })
        .catch(function(err){
          Code.expect(err).to.not.exist();
        })
        .done();
    });
  });

  lab.experiment('identify', function(){

    lab.test('works without creating a new programmer instance first', function(done){
      bs2.identify(options, function(err, result){
        Code.expect(err).to.not.exist();
        Code.expect(result).to.deep.equal({name: 'BS2', version: '1.0'});
        done();
      });
    });

    lab.test('supports the promise pattern', function(done){
      bs2.identify(options)
        .then(function(result){
          Code.expect(result).to.deep.equal({name: 'BS2', version: '1.0'});
          done();
        })
        .catch(function(err){
          Code.expect(err).to.not.exist();
        })
        .done();
    });
  });

  lab.experiment('bootload', function(){

    lab.beforeEach(function(done){
      //send bs2 response bytes, then the success byte
      serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00]));
      done();
    });

    lab.test('works without creating a new programmer instance first', function(done){
      bs2.bootload(hi, options, function(err){
        Code.expect(err).to.not.exist();
        done();
      });
    });

    lab.test('supports the promise pattern', function(done){
      bs2.bootload(hi, options)
        .then(function(){
          done();
        })
        .catch(function(err){
          Code.expect(err).to.not.exist();
        })
        .done();
    });
  });
});
