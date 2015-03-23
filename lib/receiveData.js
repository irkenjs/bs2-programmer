/*eslint-disable no-use-before-define */
'use strict';

var TimeoutError = require('./timeouterror.js');

module.exports = function (stream, timeout, responseLength, callback) {
  var buffer = new Buffer(0);
  var timeoutId = null;
  var handleChunk = function (data) {
    buffer = Buffer.concat([buffer, data]);
    if (buffer.length > responseLength) {
      // or ignore after
      return finished(new Error('buffer overflow ' + buffer.length + ' > ' + responseLength));
    }
    if (buffer.length === responseLength) {
      finished();
    }
  };
  var finished = function (err) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    stream.removeListener('data', handleChunk);
    callback(err, buffer);
  };
  if (timeout && timeout > 0) {
    timeoutId = setTimeout(function () {
      timeoutId = null;
      finished(new TimeoutError('receiveData timeout after ' + timeout + 'ms ' + buffer.length + ' < ' + responseLength));
    }, timeout);
  }
  stream.on('data', handleChunk);
};
