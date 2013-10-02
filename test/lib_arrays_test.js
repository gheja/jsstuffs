var assert = require('assert');

var ArbitaryArray = require('../src/lib/arrays.js');

describe('ArbitaryArray', function() {
	var obj = null;
	
	describe('<constructor>([ 1, 2, 3, 4 ], 256)', function() {
		it('should not throw an error', function () {
			obj = new ArbitaryArray([ 1, 2, 3, 4 ], 256);
		});
	});
	describe('readOne()', function() {
		it('should return 1', function () {
			var result = obj.readOne();
			assert.equal(result, 1);
		});
	});
	describe('readTwo()', function() {
		it('should return 2 + 3*256', function () {
			var result = obj.readTwo();
			assert.equal(result, 2 + 3*256);
		});
	});
	describe('eof()', function() {
		it('should return false, when not at end of array', function () {
			var result = obj.eof();
			assert.equal(result, false);
		});
		
		
		it('should return true, when at end of array', function () {
			// read the last item
			obj.readOne();
			
			var result = obj.eof();
			assert.equal(result, true);
		});
	});
	describe('seek()', function() {
		it('seek(1)', function () {
			obj.seek(1);
		});
		it('readOne() should return 2', function () {
			var result = obj.readOne();
			assert.equal(result, 2);
		});
	});
	describe('add(5), add(6)', function() {
		it('should run without errors', function () {
			obj.add(5);
			obj.add(6);
		});
	});
	describe('getAsUint8Array()', function() {
		it('should return correct Uint8Array', function () {
			var result = obj.getAsUint8Array();
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
			var result = obj.getAsUint16Array();
			assert.equal(result[0] + result[1] * 256, 1 + 2*256);
			assert.equal(result[2] + result[3] * 256, 3 + 4*256);
			assert.equal(result[4] + result[5] * 256, 5 + 6*256);
		});
	});
	
});
