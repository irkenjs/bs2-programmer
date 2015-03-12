'use strict';

var when = require('when');
var nodefn = require('when/node');

var receiveData = require('./receiveData');

module.exports = function send(stream, timeout, data, cb){
  return nodefn.bindCallback(when.promise(function(resolve, reject) {

    stream.write(data, function (err) {
      var error;
      if (err) {
        error = new Error('Sending ' + data.toString('hex') + ': ' + err.message);
        return reject(error);
      }
      receiveData(stream, timeout, data.length + 1, function (err, response) {
        if (err) {
          error = new Error('Sending ' + data.toString('hex') + ': ' + err.message);
          return reject(error);
        }

        resolve(response[data.length]);
      });
    });

  }), cb);
};
