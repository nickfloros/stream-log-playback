'use strict';
const {
	Transform,
} = require('stream');

/**
 * fires events based on time difference between 
 * successive entries. entry is delayed 
 */
module.exports = class LogTimeSeries extends Transform {
	constructor(params) {
		super(params);
		this._timeToWait = params.timeToWait || this._defaultTimeToWait;
		this._resolution = params.timeResolution || 1;
	}

	_defaultTimeToWait(entry){
		return entry.dt;
	}

	_transform(chunck, encoding, callback) {
		const entry = JSON.parse(chunck.toString());
		const timeToWait = this._timeToWait(entry);
		if (timeToWait > this._resolution) {
			setTimeout(() => {
				callback(null, entry.rawJson);
			}, Math.round(timeToWait));
		} else {
			callback(null, entry.rawJson);
		}
	}
};
