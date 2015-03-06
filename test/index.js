'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var bs2 = require('../');
var hardware = require('../mock/hardware');


lab.experiment('bs2', function () {

  var hw;
  lab.beforeEach(function (done) {
    hw = hardware();
    done();
  });

  lab.test('times out', function (done) {

    bs2.identify(hw, bs2.revisions.bs2, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Sending 42: receiveData timeout after 1000ms');
      done();
    });
  });

  lab.test('fails on incorrect response', function (done) {

    hw.setData(new Buffer([0xC8, 0xAD, 0xCE, 0x10]));
    bs2.identify(hw, bs2.revisions.bs2, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Incorrect Response: 200');
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

  lab.test('bootload bs2', function (done) {

    //send bs2 response bytes, then the success byte
    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x00]));
    bs2.bootload(hw, bs2.revisions.bs2, new Buffer([0x00, 0x01, 0x02, 0x03]), function(error, result){

      Code.expect(error).to.not.exist();
      Code.expect(result).to.deep.equal({name: 'BS2', version: '1.0'});
      done();
    });
  });


  lab.test('bootload bs2 error byte', function (done) {

    //send bs2 response bytes, then the error byte
    hw.setData(new Buffer([0xBE, 0xAD, 0xCE, 0x10, 0x01]));
    bs2.bootload(hw, bs2.revisions.bs2, new Buffer([0x00, 0x01, 0x02, 0x03]), function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Bad bootload response: 1');
      done();
    });
  });

});
