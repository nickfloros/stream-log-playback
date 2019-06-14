'use strict';

const {
	Writable
} = require('stream');
const fs = require('fs');
/**
 * nano second to microsecond 
 * @type {Number}
 */
const NS_TO_MS = 0.000001;
/**
 * second to microsecond
 * @type {Number}
 */
const SEC_TO_MS = 1000;

module.exports = class StreamLogRecorder extends Writable {
	constructor(wStream, params) {
		super(params);

		this._writeStream = wStream;
		this._time = process.hrtime();

		this.on('finish', () => {
			this._writeStream.end();
		});

	}

	_timeToWait() {
		const dt = process.hrtime(this._time);
		return dt[0] * SEC_TO_MS + dt[1] * NS_TO_MS;
	}

	/**
	 * write data to the file stream and forward payload to next ... stream if there is one ... 
	 * @param  {Buffer}   chunck   represent an event to store .. 
	 * @param  {string}   encoding of data passed 
	 * @param  {Function} callback called when write completes .. 
	 */
	_write(chunck, encoding, callback) {
		const payload = {
			dt: this._timeToWait(),
			payload: chunck.toString()
		}
		this._time = process.hrtime();
		// split to file logger ... 
		this._writeStream.write(JSON.stringify(payload) + '\n');
		// contunue ... 
		callback(null, chunck);
	}

	/**
	 * lazy funciton to create a stream log recorder with output to a file
	 * @param  {Object} params [description]
	 * @param {string} params.fileName name of file where stream to be stored .. 
	 * @param {string} params.flags useal writeFileStream flags - details to 'w' but could be put to 'a' to append data to an existing file
	 * @param {string} params.autoclose controls behaviour of file created to store stream
	 * @return {StreamLogRecorder}        [description]
	 */
	static createInterface(params) {
		const options = {
			flags: (params && params.flags) ? params.flags : 'w',
			autoclose: (params && params.autoclose) ? params.autoclose : true,

		};
		const fileStream = fs.createWriteStream(params.fileName, options);
		return new StreamLogRecorder(fileStream, params);
	}
}