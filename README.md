#bs2

[![Build Status](https://travis-ci.org/jacobrosenthal/bs2-programmer.svg)](https://travis-ci.org/jacobrosenthal/bs2-programmer)

Upload tokenized hex to Basic Stamp 2.

#note
* Currently only uploads to BS2, not 2e, 2sx, etc.
* You need [newer drivers](http://www.ftdichip.com/Drivers/VCP.htm)

#install
---
Install [node.js](http://nodejs.org/). Then cd to this directory and install dependencies **from source**:
```
npm install
```

#examples
---
To upload the debug "Hi" example to your device, from the main directory type:
```
node examples/hi.js yourttyporthere
```
You should see something like:
```
Jacobs-MacBook-Air-2:bs2-programmer jacobrosenthal$ node examples/hi.js /dev/tty.usbserial-A502BMUQ
success  { name: 'BS2', version: '1.0' }
Jacobs-MacBook-Air-2:bs2-programmer jacobrosenthal$
```

#api
----
##bootload
```
bootload(stream, hex, cb)
```

* Uploads your hex of Node Buffer of tokenized data.
* Takes a previously opened, reset stream-style object (See the example for details) and a Node buffer of tokenized bytes to send.
* Callback has singature (error, object) where object is a version object like { name: 'BS2', version: '1.0' }

##identify

```
identify(stream, revision, cb)
```

* Called for you by bootload, but exposed for your convenience. 
* Takes a previously opened, reset stream-style object (See the example for details) and a Node buffer of tokenized bytes to send.
* Callback has singature (error, object) where object is a version object like { name: 'BS2', version: '1.0' }
