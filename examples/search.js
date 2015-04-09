/*eslint-disable no-process-exit */
'use strict';

var most = require('most');
var nodefn = require('when/node');

var bs2 = require('../');
var Bs2SerialProtocol = require('bs2-serial-protocol');

// tries all revisions against the board

function search(path, done){

  var protocol = new Bs2SerialProtocol({ path: path });

  var revs = Object.keys(bs2.revisions);

  var stream = most.unfold(function(idx){
    var bs2Options = {
      protocol: protocol,
      revision: revs[idx]
    };

    // TODO: this needs a better abstraction because it is leaking
    // implementation details
    // maybe this could be a `search` method on programmer????
    return protocol.enterProgramming()
      .then(function(){
        return bs2.identify(bs2Options);
      })
      .then(function(content){
        return { value: content, done: true };
      })
      .catch(function(){
        return { value: null, seed: idx + 1 };
      })
      .finally(function(){
        return protocol.exitProgramming();
      });
  }, 0);

  var promise = stream
    .skipWhile(function(val){
      return val == null;
    })
    .drain();

  nodefn.bindCallback(promise, done);
}

if(process && process.argv && process.argv[2]){
  search(process.argv[2], function(error, board){
    if(error){
      console.log('error ', error);
    } else {
      console.log('found ', board);
    }
    process.exit(0);
  });
} else {
  console.log('call with a path like /dev/tty.something');
  process.exit(0);
}
