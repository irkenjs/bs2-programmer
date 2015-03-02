'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var bs2 = require('../');
var hardware = require('../mock/hardware');

lab.experiment('identifyBS2', function () {

  var hw;
  lab.before(function (done) {

    hw = hardware();
    done();
  });

  lab.after(function (done) {

    hw = null;
    done();
  });

  lab.test('times out', function (done) {

    bs2.identifyBS2(hw, function(error){

      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Sending 42: receiveData timeout after 1000ms');
      done();
    });
  });

  lab.test('fails on incorrect response', function (done) {

    var response = 200;
    bs2.identifyBS2(hw, function(error){
      
      Code.expect(error).to.exist();
      Code.expect(error.message).to.equal('Incorrect Response: ', response);
      done();
    });

    process.nextTick(function(){

      hw.insert(new Buffer([response]));
    });
    
  });

  lab.test('succeeds on correct response', function (done) {

    hw.setData(new Buffer([190, 173, 206, 16]));
    bs2.identifyBS2(hw, function(error, result){
      
      Code.expect(error).to.not.exist();
      Code.expect(result).to.be.equal(16);
      done();
    });
  });

});