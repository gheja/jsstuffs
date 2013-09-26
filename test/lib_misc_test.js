var assert = require('assert');

require('../src/lib/misc.js');

describe('Miscellaneous helpers', function() {
	describe('clamp()', function() {
		it('clamp(5, 10, 20) should return 10', function () {
			var result = clamp(5, 10, 20);
			assert.equal(result, 10);
		});
		it('clamp(15, 10, 20) should return 15', function () {
			var result = clamp(15, 10, 20);
			assert.equal(result, 15);
		});
		it('clamp(25, 10, 20) should return 20', function () {
			var result = clamp(25, 10, 20);
			assert.equal(result, 20);
		});
	});
	describe('clamp_and_round_uint8()', function() {
		it('clamp_and_round_uint8(-2) should return 0', function () {
			var result = clamp_and_round_uint8(-2);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint8(123) should return 123', function () {
			var result = clamp_and_round_uint8(123);
			assert.equal(result, 123);
		});
		it('clamp_and_round_uint8(270) should return 255', function () {
			var result = clamp_and_round_uint8(270);
			assert.equal(result, 255);
		});
	});
	describe('clamp_and_round_int16()', function() {
		it('clamp_and_round_int16(-60000) should return -32768', function () {
			var result = clamp_and_round_int16(-60000);
			assert.equal(result, -32768);
		});
		it('clamp_and_round_int16(12345) should return 12345', function () {
			var result = clamp_and_round_int16(12345);
			assert.equal(result, 12345);
		});
		it('clamp_and_round_int16(70000) should return 32767', function () {
			var result = clamp_and_round_int16(70000);
			assert.equal(result, 32767);
		});
	});
});
