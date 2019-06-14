'use strict';


const	LogFileReader = require('./log-file-reader.service');
const LogTimeSeries = require('./log-time-series.service');

module.exports = class StreamLogReader {
	static createInterface(params) {
		const reader = new LogFileReader(params.logFileName);
		const timeSeries = new LogTimeSeries(params);
		reader.pipe(timeSeries);
		return timeSeries;
	}
}