'use strict';

const {
	Writable
} = require('stream');
const fs = require('fs');;

const NS_TO_MS = 0.000001;
const SEC_TO_MS = 1000;

module.exports = class StreamLogger extends Writable {
	constructor(params) {
		super(params);
		const options = {
			flags : (params && params.flags) ? params.flags : 'w',
			autoclose : (params && params.autoclose) ? params.autoclose : true,

		};

		this._fileStream = fs.createWriteStream(params.fileName,options);
		this._time = process.hrtime();

		this.on('finish',()=>{
		 	this._fileStream.end();
		});

	}

	timeToWait() {
		const dt = process.hrtime(this._time);
		return dt[0]* SEC_TO_MS + dt[1] * NS_TO_MS;		
	}

	_write(chunck, encoding, callback) {
		const payload = {
			dt: this.timeToWait(),
			payload: chunck.toString()
		}
		this._time = process.hrtime();
		// split to file logger ... 
		this._fileStream.write(JSON.stringify(payload) + '\n');
		// contunue ... 
		callback(null, chunck);
	}

	static createInterface(params) {
		return new StreamLogger(params);
	}
}


