var assert = require('assert');

var Lib = require('../src/lib/misc.js');

describe('Miscellaneous helpers: Lib', function() {
	var obj = null;
	
	describe('<constructor>', function() {
		it('should not throw an error', function () {
			obj = new Lib();
		});
	});
	describe('clamp()', function() {
		it('clamp(5, 10, 20) should return 10', function () {
			var result = obj.clamp(5, 10, 20);
			assert.equal(result, 10);
		});
		it('clamp(15, 10, 20) should return 15', function () {
			var result = obj.clamp(15, 10, 20);
			assert.equal(result, 15);
		});
		it('clamp(25, 10, 20) should return 20', function () {
			var result = obj.clamp(25, 10, 20);
			assert.equal(result, 20);
		});
	});
	describe('clampAndRoundUint8()', function() {
		it('clampAndRoundUint8(-2) should return 0', function () {
			var result = obj.clampAndRoundUint8(-2);
			assert.equal(result, 0);
		});
		it('clampAndRoundUint8(123) should return 123', function () {
			var result = obj.clampAndRoundUint8(123);
			assert.equal(result, 123);
		});
		it('clampAndRoundUint8(270) should return 255', function () {
			var result = obj.clampAndRoundUint8(270);
			assert.equal(result, 255);
		});
	});
	describe('clampAndRoundInt16()', function() {
		it('clampAndRoundInt16(-60000) should return -32768', function () {
			var result = obj.clampAndRoundInt16(-60000);
			assert.equal(result, -32768);
		});
		it('clampAndRoundInt16(12345) should return 12345', function () {
			var result = obj.clampAndRoundInt16(12345);
			assert.equal(result, 12345);
		});
		it('clampAndRoundInt16(70000) should return 32767', function () {
			var result = obj.clampAndRoundInt16(70000);
			assert.equal(result, 32767);
		});
	});
});
