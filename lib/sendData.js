'use strict';

var receiveData = require('./receiveData');

module.exports = function send(stream, timeout, data, cb){

  stream.write(data, function (err) {
    var error;
    if (err) {
      error = new Error('Sending ' + data.toString('hex') + ': ' + err.message);
      return cb(error);
    }
    receiveData(stream, timeout, data.length+1, function (err, response) {
      if (err) {
        error = new Error('Sending ' + data.toString('hex') + ': ' + err.message);
        return cb(error);
      }

      cb(null, response[data.length]);
    });
  });
};
