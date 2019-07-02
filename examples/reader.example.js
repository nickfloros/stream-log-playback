'use strict';

const {
	StreamLogReader
} = require('../src');


const logFileName = './sample-stream.json';

StreamLogReader.createInterface({
		logFileName
	})
.on('data',(entry)=>{
	console.log(entry.toString()+`\n`);
})
.on('end',()=>{
	console.log('we are finished');
});
