'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var bs2 = require('../');
var hardware = require('../mock/hardware');

var hi = new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x30, 0xA0, 0xC7, 0x92, 0x66, 0x48, 0x13, 0x84, 0x4C, 0x35, 0x07, 0xC0, 0x4B]);
var blink = new Buffer([0xfe, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x14, 0x20, 0x8c, 0x0e, 0xd8, 0xc8, 0x7c, 0xff, 0x0e, 0x60, 0x4a, 0xae, 0xe8, 0x9f, 0x49, 0xc1, 0x50, 0xc3, 0x6f, 0x8d, 0xd1, 0x03, 0x07, 0xc0, 0x60]);

lab.experiment('bs2', function () {

  var hw;
  lab.beforeEach(function (done) {
    hw = hardware();
    done();
  });

  lab.test('times out', function (done) {

    bs2.identify(hw, bs2.revisions.bs2, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('BS2 did not respond. Check power, connection, or maybe this is not a BS2');
      done();
    });
  });

  lab.test('fails on incorrect response', function (done) {

    hw.setData(new Buffer([0xC8, 0xAD, 0xCE, 0x10]));
    bs2.identify(hw, bs2.revisions.bs2, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Incorrect Response: 200. Board might not be a BS2');
      done();
    });
  });

  lab.test('bs2 1.0', function (done) {

    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10]));
    bs2.identify(hw, bs2.revisions.bs2, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2', version: '1.0'});
      done();
    });
  });

  lab.test('bs2 less than one character', function (done) {

    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x00]));
    bs2.identify(hw, bs2.revisions.bs2, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2', version: '0'});
      done();
    });
  });

  lab.test('bs2e 1.0', function (done) {

    hw.setData(new Buffer([0x65]));
    bs2.identify(hw, bs2.revisions.bs2e, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2e', version: '1.0'});
      done();
    });
  });

  lab.test('bs2e unknown', function (done) {

    hw.setData(new Buffer([0x02]));
    bs2.identify(hw, bs2.revisions.bs2e, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });


  lab.test('bs2sx 1.0', function (done) {

    hw.setData(new Buffer([0x58]));
    bs2.identify(hw, bs2.revisions.bs2sx, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.0'});
      done();
    });
  });

  lab.test('bs2sx 1.1', function (done) {

    hw.setData(new Buffer([0x59]));
    bs2.identify(hw, bs2.revisions.bs2sx, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.1'});
      done();
    });
  });

  lab.test('bs2sx 1.2', function (done) {

    hw.setData(new Buffer([0x60]));
    bs2.identify(hw, bs2.revisions.bs2sx, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2sx', version: '1.2'});
      done();
    });
  });

  lab.test('bs2sx unknown', function (done) {

    hw.setData(new Buffer([0x02]));
    bs2.identify(hw, bs2.revisions.bs2sx, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bs2p 1.0', function (done) {

    hw.setData(new Buffer([0x70]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.0'});
      done();
    });
  });

  lab.test('bs2p 1.1', function (done) {

    hw.setData(new Buffer([0x71]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.1'});
      done();
    });
  });

  lab.test('bs2p 1.2', function (done) {

    hw.setData(new Buffer([0x72]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.2'});
      done();
    });
  });

  lab.test('bs2p 1.3', function (done) {

    hw.setData(new Buffer([0x73]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p24', version: '1.3'});
      done();
    });
  });

  lab.test('bs2p 1.0', function (done) {

    hw.setData(new Buffer([0x50]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.0'});
      done();
    });
  });

  lab.test('bs2p 1.1', function (done) {

    hw.setData(new Buffer([0x51]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.1'});
      done();
    });
  });

  lab.test('bs2p 1.2', function (done) {

    hw.setData(new Buffer([0x52]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.2'});
      done();
    });
  });

  lab.test('bs2p 1.3', function (done) {

    hw.setData(new Buffer([0x53]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2p40', version: '1.3'});
      done();
    });
  });

  lab.test('bs2p unknown', function (done) {

    hw.setData(new Buffer([0x02]));
    bs2.identify(hw, bs2.revisions.bs2p, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bs2pe 1.0', function (done) {

    hw.setData(new Buffer([0x69]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.0'});
      done();
    });
  });

  lab.test('bs2pe 1.1', function (done) {

    hw.setData(new Buffer([0x70]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.1'});
      done();
    });
  });

  lab.test('bs2pe 1.2', function (done) {

    hw.setData(new Buffer([0x71]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe24', version: '1.2'});
      done();
    });
  });

  lab.test('bs2pe 1.0', function (done) {

    hw.setData(new Buffer([0x49]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.0'});
      done();
    });
  });

  lab.test('bs2pe 1.1', function (done) {

    hw.setData(new Buffer([0x50]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.1'});
      done();
    });
  });

  lab.test('bs2pe 1.2', function (done) {

    hw.setData(new Buffer([0x51]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2pe40', version: '1.2'});
      done();
    });
  });

  lab.test('bs2pe unknown', function (done) {

    hw.setData(new Buffer([0x02]));
    bs2.identify(hw, bs2.revisions.bs2pe, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Unknown: 2');
      done();
    });
  });

  lab.test('bootload throws with non multiple of 18 byte data', function (done) {

    var throws = function () {
        bs2.bootload(hw, bs2.revisions.bs2, new Buffer([0x00, 0x01, 0x02, 0x03]), 1000, function(){});
    };

    Code.expect(throws).to.throw(Error, 'Data must be in multiples of 18 bytes');
    done();
  });

  lab.test('bootload bs2 with 18 byte packet', function (done) {

    //send bs2 response bytes, then the success byte
    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00]));
    bs2.bootload(hw, bs2.revisions.bs2, hi, 1000, function(error){

      Code.expect(error).to.not.exist();
      done();
    });
  });

  lab.test('bootload bs2 with 36 byte packet', function (done) {

    //send bs2 response bytes, then 2 success bytes, 1 for each packet
    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00, 0x00]));
    bs2.bootload(hw, bs2.revisions.bs2, blink, 1000, function(error){

      Code.expect(error).to.not.exist();
      done();
    });
  });

  lab.test('bootload bs2 error byte', function (done) {

    //send bs2 response bytes, then the error byte which should stop bootload at first 18 byte packet
    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x01]));
    bs2.bootload(hw, bs2.revisions.bs2, blink, 1000, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Board nacked packet 0 with code: 1');
      done();
    });
  });

});
