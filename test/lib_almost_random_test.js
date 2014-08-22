var assert = require('assert');

require('../src/lib/almost_random.js');

describe('AlmostRandom', function() {
	var obj = null;
	
	describe('first test', function() {
		it('<constructor>(1337) should not throw an error', function () {
			obj = new AlmostRandom(1337);
		});
		it('1st random() should return 0.4170927882593894', function () {
			var result = obj.random();
			assert.equal(result, 0.4170927882593894);
		});
		it('2nd random() should return 0.7031074097684702', function () {
			var result = obj.random();
			assert.equal(result, 0.7031074097684702);
		});
		it('3rd random() should return 0.5449835202842921', function () {
			var result = obj.random();
			assert.equal(result, 0.5449835202842921);
		});
	});
	describe('second test', function() {
		it('<constructor>(42) should not throw an error', function () {
			obj = new AlmostRandom(42);
		});
		it('1st random() should return 0.39723574809771184', function () {
			var result = obj.random();
			assert.equal(result, 0.39723574809771184);
		});
		it('2nd random() should return 0.9895696284943101', function () {
			var result = obj.random();
			assert.equal(result, 0.9895696284943101);
		});
		it('3rd random() should return 0.0041368833670161545', function () {
			var result = obj.random();
			assert.equal(result, 0.0041368833670161545);
		});
	});
});
