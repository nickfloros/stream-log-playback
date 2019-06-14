'use strict';

const StreamLogReader = require('../../src/stream-log-reader');

describe('stream-log-reader ', () => {

	it('should read sample file', (done) => {
		const logFileName = `${__dirname}/../mock-data/sample.json`;
		const buffer = [];


		StreamLogReader.createInterface({
				logFileName
			})
			.on('data', (chunk) => {
				buffer.push(chunk.toString());
			})
			.on('end', () => {
				expect(buffer.length).toBe(2);
				done();
			});
	});

})