var assert = require('assert');

require('../src/lib/arrays.js');

var array = new ArbitaryArray([1, 2, 3, 4], 256);

console.log(array);

describe('ArbitaryArray', function() {
	describe('readOne()', function() {
		it('should return 1', function () {
			var result = array.readOne();
			assert.equal(result, 1);
		});
	});
	describe('readTwo()', function() {
		it('should return 2 + 3*256', function () {
			var result = array.readTwo();
			assert.equal(result, 2 + 3*256);
		});
	});
	describe('eof()', function() {
		it('should return false, when not at end of array', function () {
			var result = array.eof();
			assert.equal(result, false);
		});
		
		
		it('should return true, when at end of array', function () {
			// read the last item
			array.readOne();
			
			var result = array.eof();
			assert.equal(result, true);
		});
	});
	describe('add(5), add(6)', function() {
		it('should run without errors', function () {
			array.add(5);
			array.add(6);
		});
	});
	describe('getAsUint8Array()', function() {
		it('should return correct Uint8Array', function () {
			var result = array.getAsUint8Array();
			assert.equal(result[0], 1);
			assert.equal(result[1], 2);
			assert.equal(result[2], 3);
			assert.equal(result[3], 4);
			assert.equal(result[4], 5);
			assert.equal(result[5], 6);
		});
	});
	describe('getAsUint16Array()', function() {
		it('should return correct Uint16Array', function () {
			var result = array.getAsUint16Array();
			assert.equal(result[0] + result[1] * 256, 1 + 2*256);
			assert.equal(result[2] + result[3] * 256, 3 + 4*256);
			assert.equal(result[4] + result[5] * 256, 5 + 6*256);
		});
	});
	
});
