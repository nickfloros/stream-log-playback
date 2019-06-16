'use strict';

const fs = require('fs');
const {Writable} = require('stream');
const StreamLogWriter = require('../../src/stream-log-writer');

class MockWriteStream extends Writable {
	constructor(params) {
		super(params);
		this._buffer = [];
	}
	_write(chunk,encoding, callback) {
		this._buffer.push(chunk.toString());
		callback();
	}

	get buffer() {
		return this._buffer;
	}
}

describe('stream-log-recoder',()=>{
	
	let mockWriterStream;

	beforeEach(()=>{
		mockWriterStream = new MockWriteStream();
		spyOn(fs,'createWriteStream').and.callFake(()=>{
			return mockWriterStream;
		});

	})	

	it('should create a StreamLogWriter with a file writeable stream ',(done)=>{

		const streamLogWriter = StreamLogWriter.createInterface({fileName : 'x'});

		mockWriterStream.on('finish',()=>{
			expect(mockWriterStream.buffer.length).toBe(1);
			const entry = JSON.parse(mockWriterStream._buffer[0]);
			expect(entry.dt).toBeTruthy();
			expect(entry.payload).toBeTruthy();
			done();
		});

		streamLogWriter.write(JSON.stringify({a:1}));
		streamLogWriter.end();

	});

	it('should use some of the custom properties to create a StreamLogWriter with a file writeable stream ',()=>{
		const streamLogWriter = StreamLogWriter.createInterface({
			fileName : 'x',
			flags : 'x',
			autoclose: false
		});
		expect(streamLogWriter).toBeTruthy();
		expect(fs.createWriteStream).toHaveBeenCalledWith('x',{flags:'x',autoclose:false});
	});

	it('should create a StreamLogWriter with a custom writable stream ',(done)=>{
		const streamLogWriter = StreamLogWriter.createInterface({
			output : mockWriterStream
		});

		mockWriterStream.on('finish',()=>{
			expect(mockWriterStream.buffer.length).toBe(1);
			const entry = JSON.parse(mockWriterStream._buffer[0]);
			expect(entry.dt).toBeTruthy();
			expect(entry.payload).toBeTruthy();
			done();
		});

		streamLogWriter.write(JSON.stringify({a:1}));
		streamLogWriter.end();

	});
});