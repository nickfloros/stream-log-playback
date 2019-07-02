# stream-log-playback

[![CircleCI](https://circleci.com/gh/nickfloros/stream-log-playback.svg?style=svg)](https://circleci.com/gh/nickfloros/stream-log-playback) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/cf9630a2c0014fce8d5e63a0807d9738)](https://www.codacy.com/app/nickfloros/stream-log-playback?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nickfloros/stream-log-playback&amp;utm_campaign=Badge_Grade)



A simple library that reproduces a data stream for development purposes, while respecting order and time separation between events

The library providers both recorder and playback functions

The recorder is an implementation of pass-throught ```Writable```stream can be wired either in a pipeline e.g. 
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
In either case the recorder will persist the data to a file called ```stream.log```, and the pass the original data to next stage of the pipeline.

The generated format is as following
```json
{	"dt": 151.321274,	"rawJson": "{\"key\":2500178}"}
{	"dt": 0.483183,	"rawJson": "{\"key\":2500356}"}
```

Each line represents an envent with the properties
| property name | description |
| dt            | the time in msec the event was generated from the previous line |
| rawJson       | event details |

So in the above example the first line says , wait for 151 msec before creating the first event. he second line for 8 msec. 

The reader implments ```Tranform``` stream

```javascript
const {StreamLogReader} = require('stream-log-playback');

const reader = new StreamLogReader({
  fileName:'stream.log'
  });

reader.on('data',(lineEntry)=>{
  console.log(line.toString());
});
````
