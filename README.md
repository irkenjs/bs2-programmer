#bs2
---
Upload tokenized hex to Basic Stamp 2.

#note
* Currently only identifies BS2, not 2e, 2sx, etc.
* Supports unix environments only right now, based on a fork of node-serialport for break support
* You need [newer drivers](http://www.ftdichip.com/Drivers/VCP.htm)

#install
---
Install [node.js](http://nodejs.org/). Then cd to this directory and install dependencies:
```
npm i
```

#examples
---
To upload the debug "Hi" example do your device, from the main directory:
```
node examples/hi.js yourttyporthere
```
You should see something like:
```
Jacobs-MacBook-Air-2:bs2-programmer jacobrosenthal$ node examples/hi.js /dev/tty.usbserial-A502BMUQ
resetting
asserting dtr, asserting brk
asserted dtr, asserted brk
clearing dtr
cleared dtr
clearing brk
reset complete
identifying
identify SUCCESS. Version:  16
programing SUCCESS!
Jacobs-MacBook-Air-2:bs2-programmer jacobrosenthal$
```

#api
----
All functions take a previously opened stream-style object, in this case a serialport. See example for how to pre instantiate.

##bootload
The only function you should need. Uploads your hex of Node Buffer of tokenized data with a time to Break during reset.
```
bootload(stream, time, hex, cb)
```

##reset
Called for you by bootload, but exposed for your convenience. Time is the amount of time to Break during reset.
```
reset(stream, time, cb)
```

##identify
Called for you by bootload, but exposed for your convenience. Returns the version.
```
identifyBS2(stream, cb)
```


