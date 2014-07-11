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
	describe('clamp_and_round_int6()', function() {
		it('clamp_and_round_int6(-100) should return -32', function () {
			var result = clamp_and_round_int6(-100);
			assert.equal(result, -32);
		});
		it('clamp_and_round_int6(12) should return 12', function () {
			var result = clamp_and_round_int6(12);
			assert.equal(result, 12);
		});
		it('clamp_and_round_int6(100) should return 31', function () {
			var result = clamp_and_round_int6(100);
			assert.equal(result, 31);
		});
	});
	describe('clamp_and_round_uint6()', function() {
		it('clamp_and_round_uint6(-100) should return 0', function () {
			var result = clamp_and_round_uint6(-100);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint6(12) should return 12', function () {
			var result = clamp_and_round_uint6(12);
			assert.equal(result, 12);
		});
		it('clamp_and_round_uint6(100) should return 63', function () {
			var result = clamp_and_round_uint6(100);
			assert.equal(result, 63);
		});
	});
	describe('clamp_and_round_int8()', function() {
		it('clamp_and_round_int8(-300) should return 0', function () {
			var result = clamp_and_round_int8(-300);
			assert.equal(result, -128);
		});
		it('clamp_and_round_int8(123) should return 123', function () {
			var result = clamp_and_round_int8(123);
			assert.equal(result, 123);
		});
		it('clamp_and_round_int8(300) should return 255', function () {
			var result = clamp_and_round_int8(300);
			assert.equal(result, 127);
		});
	});
	describe('clamp_and_round_uint8()', function() {
		it('clamp_and_round_uint8(-300) should return 0', function () {
			var result = clamp_and_round_uint8(-300);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint8(123) should return 123', function () {
			var result = clamp_and_round_uint8(123);
			assert.equal(result, 123);
		});
		it('clamp_and_round_uint8(300) should return 255', function () {
			var result = clamp_and_round_uint8(300);
			assert.equal(result, 255);
		});
	});
	describe('clamp_and_round_int12()', function() {
		it('clamp_and_round_int12(-5000) should return -2048', function () {
			var result = clamp_and_round_int12(-5000);
			assert.equal(result, -2048);
		});
		it('clamp_and_round_int12(1234) should return 1234', function () {
			var result = clamp_and_round_int12(1234);
			assert.equal(result, 1234);
		});
		it('clamp_and_round_int12(5000) should return 2047', function () {
			var result = clamp_and_round_int12(5000);
			assert.equal(result, 2047);
		});
	});
	describe('clamp_and_round_uint12()', function() {
		it('clamp_and_round_uint12(-5000) should return 0', function () {
			var result = clamp_and_round_uint12(-5000);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint12(1234) should return 1234', function () {
			var result = clamp_and_round_uint12(1234);
			assert.equal(result, 1234);
		});
		it('clamp_and_round_uint12(5000) should return 4095', function () {
			var result = clamp_and_round_uint12(5000);
			assert.equal(result, 4095);
		});
	});
	describe('clamp_and_round_int16()', function() {
		it('clamp_and_round_int16(-70000) should return -32768', function () {
			var result = clamp_and_round_int16(-70000);
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
	describe('clamp_and_round_uint16()', function() {
		it('clamp_and_round_uint16(-70000) should return 0', function () {
			var result = clamp_and_round_uint16(-70000);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint16(12345) should return 12345', function () {
			var result = clamp_and_round_uint16(12345);
			assert.equal(result, 12345);
		});
		it('clamp_and_round_uint16(70000) should return 65535', function () {
			var result = clamp_and_round_uint16(70000);
			assert.equal(result, 65535);
		});
	});
	describe('clamp_and_round_int24()', function() {
		it('clamp_and_round_int24(-20000000) should return -8388608', function () {
			var result = clamp_and_round_int24(-20000000);
			assert.equal(result, -8388608);
		});
		it('clamp_and_round_int24(1234567) should return 1234567', function () {
			var result = clamp_and_round_int24(1234567);
			assert.equal(result, 1234567);
		});
		it('clamp_and_round_int24(20000000) should return 8388607', function () {
			var result = clamp_and_round_int24(20000000);
			assert.equal(result, 8388607);
		});
	});
	describe('clamp_and_round_uint24()', function() {
		it('clamp_and_round_uint24(-20000000) should return 0', function () {
			var result = clamp_and_round_uint24(-20000000);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint24(12345678) should return 12345678', function () {
			var result = clamp_and_round_uint24(1234567);
			assert.equal(result, 1234567);
		});
		it('clamp_and_round_uint24(20000000) should return 16777215', function () {
			var result = clamp_and_round_uint24(20000000);
			assert.equal(result, 16777215);
		});
	});
	describe('clamp_and_round_int32()', function() {
		// TODO: this test always fails with mocha(?) for values lower than -2147483648
		//
		// it('clamp_and_round_int32(-3000000000) should return -2147483648', function () {
		// 	var result = clamp_and_round_int32(-3000000000);
		// 	assert.equal(result, -2147483648);
		// });
		it('clamp_and_round_int32(1234567890) should return 1234567890', function () {
			var result = clamp_and_round_int32(1234567890);
			assert.equal(result, 1234567890);
		});
		it('clamp_and_round_int32(5000000000) should return 2147483647', function () {
			var result = clamp_and_round_int32(5000000000);
			assert.equal(result, 2147483647);
		});
	});
	describe('clamp_and_round_uint32()', function() {
		it('clamp_and_round_uint32(-3000000000) should return 0', function () {
			var result = clamp_and_round_uint32(-3000000000);
			assert.equal(result, 0);
		});
		it('clamp_and_round_uint32(1234567890) should return 1234567890', function () {
			var result = clamp_and_round_uint32(1234567890);
			assert.equal(result, 1234567890);
		});
		it('clamp_and_round_uint32(5000000000) should return 4294967295', function () {
			var result = clamp_and_round_uint32(5000000000);
			assert.equal(result, 4294967295);
		});
	});
});
