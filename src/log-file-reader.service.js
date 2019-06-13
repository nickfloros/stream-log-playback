'use strict';
const {
	Readable
} = require('stream');
const fs = require('fs');
const readline = require('readline');

/**
 * reads a line at time from log file
 */
module.exports = class LogFileReader extends Readable {
	constructor(fname) {
		super();
		this._lineId = 0;
		this._reader = readline.createInterface({
			input: fs.createReadStream(fname)
		});

		this._reader.on('line', (line) => {
			const entry = JSON.parse(line);
			// pause lineReader to avoid intenal buffer overflow
			this._reader.pause();
			// add a line id 
			entry._lineId = this._lineId++;
			this.push(JSON.stringify(entry));
		});
		// end of file ... 
		this._reader.on('close', () => {
			this.push(null);
		});

	}

	_read() { // invoked when internal buffer is empty
		this._reader.resume();
	}

};