const {
	StreamLogWriter
} = require('../');

const writer = StreamLogWriter.createInterface({
	fileName: './sample-writer.log',
	flags: 'a'
});

writer.write(JSON.stringify({
	test: new Date()
}));

setTimeout(() => {
	writer.write(JSON.stringify({
		test: new Date()
	}));
	writer.end();
});

writer.on('end', () => {
	console.log('end');
	process.exit(0);
});