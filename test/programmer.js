'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var Bs2Protocol = require('bs2-serialport');

var Programmer = require('../').Programmer;
var hardware = require('../mock/hardware');

var hi = require('./fixtures/hi');
var blink = require('./fixtures/blink');

lab.experiment('Programmer', function () {

  var serial;
  var protocol;

  lab.beforeEach(function (done) {
    serial = hardware();
    protocol = new Bs2Protocol({ serialport: serial });
    done();
  });

  lab.test('times out', function (done) {

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('BS2 did not respond. Check power, connection, or maybe this is not a BS2');
      done();
    });
  });

  lab.test('fails on incorrect response', function (done) {

    serial.setData(new Buffer([0xC8, 0xAD, 0xCE, 0x10]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Incorrect Response: 200. Board might not be a BS2');
      done();
    });
  });

  lab.test('bs2 1.0', function (done) {

    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2', version: '1.0'});
      done();
    });
  });

  lab.test('bs2 less than one character', function (done) {

    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x00]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2', version: '0'});
      done();
    });
  });

  lab.test('bs2e 1.0', function (done) {

    serial.setData(new Buffer([0x65]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2e' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2e', version: '1.0'});
      done();
    });
  });

  lab.test('bs2e unknown', function (done) {

    serial.setData(new Buffer([0x02]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2e' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });


  lab.test('bs2sx 1.0', function (done) {

    serial.setData(new Buffer([0x58]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2sx' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.0'});
      done();
    });
  });

  lab.test('bs2sx 1.1', function (done) {

    serial.setData(new Buffer([0x59]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2sx' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.1'});
      done();
    });
  });

  lab.test('bs2sx 1.2', function (done) {

    serial.setData(new Buffer([0x60]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2sx' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.2'});
      done();
    });
  });

  lab.test('bs2sx unknown', function (done) {

    serial.setData(new Buffer([0x02]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2sx' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bs2p 1.0', function (done) {

    serial.setData(new Buffer([0x70]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.0'});
      done();
    });
  });

  lab.test('bs2p 1.1', function (done) {

    serial.setData(new Buffer([0x71]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.1'});
      done();
    });
  });

  lab.test('bs2p 1.2', function (done) {

    serial.setData(new Buffer([0x72]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.2'});
      done();
    });
  });

  lab.test('bs2p 1.3', function (done) {

    serial.setData(new Buffer([0x73]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.3'});
      done();
    });
  });

  lab.test('bs2p 1.0', function (done) {

    serial.setData(new Buffer([0x50]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.0'});
      done();
    });
  });

  lab.test('bs2p 1.1', function (done) {

    serial.setData(new Buffer([0x51]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.1'});
      done();
    });
  });

  lab.test('bs2p 1.2', function (done) {

    serial.setData(new Buffer([0x52]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.2'});
      done();
    });
  });

  lab.test('bs2p 1.3', function (done) {

    serial.setData(new Buffer([0x53]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.3'});
      done();
    });
  });

  lab.test('bs2p unknown', function (done) {

    serial.setData(new Buffer([0x02]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2p' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bs2pe 1.0', function (done) {

    serial.setData(new Buffer([0x69]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.0'});
      done();
    });
  });

  lab.test('bs2pe 1.1', function (done) {

    serial.setData(new Buffer([0x70]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.1'});
      done();
    });
  });

  lab.test('bs2pe 1.2', function (done) {

    serial.setData(new Buffer([0x71]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.2'});
      done();
    });
  });

  lab.test('bs2pe 1.0', function (done) {

    serial.setData(new Buffer([0x49]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.0'});
      done();
    });
  });

  lab.test('bs2pe 1.1', function (done) {

    serial.setData(new Buffer([0x50]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.1'});
      done();
    });
  });

  lab.test('bs2pe 1.2', function (done) {

    serial.setData(new Buffer([0x51]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.2'});
      done();
    });
  });

  lab.test('bs2pe unknown', function (done) {

    serial.setData(new Buffer([0x02]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2pe' });
    bs2.identify(function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bootload throws with non multiple of 18 byte data', function (done) {

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });

    function invalidData () {
      bs2.bootload(new Buffer([0x00, 0x01, 0x02, 0x03]), function(){});
    }

    Code.expect(invalidData).to.throw(Error, 'Data must be in multiples of 18 bytes');
    done();
  });

  lab.test('bootload bs2 with 18 byte packet', function (done) {

    //send bs2 response bytes, then the success byte
    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.bootload(hi, function(error){

      Code.expect(error).to.not.exist();
      done();
    });
  });

  lab.test('bootload bs2 with 36 byte packet', function (done) {

    //send bs2 response bytes, then 2 success bytes, 1 for each packet
    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00, 0x00]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.bootload(blink, function(error){

      Code.expect(error).to.not.exist();
      done();
    });
  });

  lab.test('bootload bs2 error byte', function (done) {

    //send bs2 response bytes, then the error byte which should stop bootload at first 18 byte packet
    serial.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x01]));

    var bs2 = new Programmer({ protocol: protocol, revision: 'bs2' });
    bs2.bootload(blink, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Board nacked packet 0 with code: 1');
      done();
    });
  });

});
