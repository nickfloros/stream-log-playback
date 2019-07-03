# stream-log-playback

[![CircleCI](https://circleci.com/gh/nickfloros/stream-log-playback.svg?style=svg)](https://circleci.com/gh/nickfloros/stream-log-playback) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/cf9630a2c0014fce8d5e63a0807d9738)](https://www.codacy.com/app/nickfloros/stream-log-playback?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nickfloros/stream-log-playback&amp;utm_campaign=Badge_Grade)



A simple library that reproduces a data stream for development purposes, while respecting order and time separation between events

The library providers both recorder and playback functions

The recorder ```StreamLogRecorder``` is an implementation of pass-throught ```Writable```stream can be wired either in a pipeline e.g. 
```javascript
const {StreamLogRecorder} = require('stream-log-playback');

const streamRecorder = StreamLogRecorder.createInterface({
	fileName : 'stream.log'
	});

someOtherStream.pipe(streamRecorder).pipe(process.stdout);
```
or data can be pushed using ```write``` function.
```javascript
const {StreamLogRecorder} = require('stream-log-playback');

const streamRecorder = StreamLogRecorder.createInterface({
	fileName : 'stream.log'
	});
  
streamRecorder.write(JSON.strigify({data:1}));
streamRecorder.write(JSON.strigify({data:2}));

streamRecorder.end();
```
### StreamLogRecorder.createInterface(options)
Create a recorder

### `options` object properties
property       | Description
---------------|------------
fileName       | name of file containing the log to read
flag s         | usual createFileStream flags. Default value is 'w' create, but if set 'a' it will ammend on existing file new entries

In either case the recorder will persist the data to a file called ```stream.log```, and the pass the original data to next stage of the pipeline.


The generated format is as following
```json
{	"dt": 151.321274,	"rawJson": "{\"key\":2500178}"}
{	"dt": 20.483183,	"rawJson": "{\"key\":2500356}"}
```

Each line represents an event with the properties

 property name | description 
-------------- | ------------
 dt            | the time in msec the event was generated from the previous event 
 rawJson       | event details 


So in the above example the first line says , wait for 151 msec before creating the first event.The second line for says wait for 20 msec. 

The reader is an implementation of a ```Tranform``` and can be used either as

```javascript
const {StreamLogReader} = require('stream-log-playback');

const reader = StreamLogReader.createInterface({
  fileName:'stream.log'
  });

reader.on('data',(lineEntry)=>{
  console.log(line.toString());
});
````

or wired in a pipeline

```javascript
const {StreamLogReader} = require('stream-log-playback');

const reader =  StreamLogReader.createInterface({
  fileName:'stream.log'
  });

reader.pipe(someOtherStream);
````
### StreamLogReader
Create a reader 
* StreamLogReader
### `options` object proerties

property       | Description
---------------|------------
fileName       | name of file containing the log to read
timeResolution | don't wait if dt < timeResolution e.g. if timeResolution is 10 then the second event in the previous exmple will fire immediately.
maxWait        | if dt>maxWait then wait for maxWait e.g. is maxWait is 100 then in the above example the first event will fire after 100 msec.