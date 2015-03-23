'use strict';

var when = require('when');
var nodefn = require('when/node');

var receiveData = require('./receiveData');

module.exports = function send(stream, timeout, data, cb){
  return nodefn.bindCallback(when.promise(function(resolve, reject) {

    stream.write(data, function (writeError) {
      if (writeError) {
        return reject(writeError);
      }
      receiveData(stream, timeout, data.length + 1, function (receiveError, response) {
        if (receiveError) {
          return reject(receiveError);
        }

        resolve(response[data.length]);
      });
    });

  }), cb);
};
