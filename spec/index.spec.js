describe('pointless test of index ...',()=>{

	let streamLogPlayback;
	
	beforeEach(()=>{
		streamLogPlayback = require('../index');
	});

	it('should have a reference to mock ...',()=>{
		expect(streamLogPlayback).toBeTruthy();
	});

	it('should expose StreamLogReader and StreamLogWritter',()=>{
		expect(streamLogPlayback.StreamLogRecorder).toBeTruthy();
		expect(streamLogPlayback.StreamLogReader).toBeTruthy();
	});

});
