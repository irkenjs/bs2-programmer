'use strict';

function TimeoutError(message) {
    this.name = 'TimeoutError';
    this.message = message;
    this.stack = (new Error()).stack;
}
TimeoutError.prototype = new Error();

module.exports = TimeoutError;
