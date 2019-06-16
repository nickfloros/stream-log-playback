describe('pointless test of index ...',()=>{

	let streamLogPlayback;
	
	beforeEach(()=>{
		streamLogPlayback = require('../../src/index');
	});

	it('should have a reference to mock ...',()=>{
		expect(streamLogPlayback).toBeTruthy();
	});

	it('should expose StreamLogReader and StreamLogWritter',()=>{
		expect(streamLogPlayback.StreamLogWriter).toBeTruthy();
		expect(streamLogPlayback.StreamLogReader).toBeTruthy();
	});

});
