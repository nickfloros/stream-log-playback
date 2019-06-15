describe('pointless test of index ...',()=>{

	const streamLogPlayback = require('../index');
	
	it('should have a reference to mock ...',()=>{
		expect(streamLogPlayback).toBeTruthy();
	});

	it('should expose StreamLogReader and StreamLogWritter',()=>{
		expect(streamLogPlayback.StreamLogRecorder).toBeTruthy();
		expect(streamLogPlayback.StreamLogReader).toBeTruthy();
	});

});
