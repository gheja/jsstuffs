var assert = require('assert');

var Dictionary = require('../src/lib/dictionary.js');

describe('Dictionary', function() {
	var obj = null;
	
	describe('<constructor>', function() {
		it('should not throw an error', function () {
			obj = new Dictionary();
		});
	});
	
	describe('addArray()', function() {
		it('should store the array [ 1, 2, 3 ] with index 0', function () {
			var result = obj.addArray([ 1, 2, 3 ]);
			assert.equal(result, 0);
		});
		it('should store the array [ 4, 5, 6 ] with index 1', function () {
			var result = obj.addArray([ 4, 5, 6 ]);
			assert.equal(result, 1);
		});
		it('should find the [ 1, 2, 3 ] array with index 0 when storing', function () {
			var result = obj.addArray([ 1, 2, 3 ]);
			assert.equal(result, 0);
		});
		it('should throw an exception when storing an empty array', function () {
			var result = false;
			
			try
			{
				obj.addArray([]);
			}
			catch (e)
			{
				result = true;
			}
			assert.equal(result, true);
		});
		it('should throw an exception when storing a more than 256 items long array', function () {
			var i, a = [], result = false;
			
			for (i=0; i<257; i++)
			{
				a[i] = i;
			}
			
			try
			{
				obj.addArray(a);
			}
			catch (e)
			{
				result = true;
			}
			assert.equal(result, true);
		});
	});
	
	describe('getArray()', function() {
		it('should return the array [ 1, 2, 3 ] for index 0', function () {
			var result = obj.getArray(0);
			assert.deepEqual(result, [ 1, 2, 3 ]);
		});
		it('should return the array [ 4, 5, 6 ] for index 1', function () {
			var result = obj.getArray(1);
			assert.deepEqual(result, [ 4, 5, 6 ]);
		});
	});
	
	describe('getContentCount()', function() {
		it('should return 2', function () {
			var result = obj.getContentCount();
			assert.equal(result, 2);
		});
	});
	
	describe('getContents()', function() {
		it('should return correct Uint8Array', function () {
			var result = obj.getContents();
			assert.deepEqual(result, new Uint8Array([ 3, 1, 2, 3, 3, 4, 5, 6 ]));
		});
	});
	
	describe('setContents()', function() {
		var input = new Uint8Array([ 3, 10, 11, 12, 3, 13, 14, 15 ]);
		
		it('should store the array... ', function () {
			obj.setContents(input);
			// assert.deepEqual(result, "");
		});
		it('... and then getContents() should return the input', function () {
			var result = obj.getContents();
			assert.deepEqual(result, input);
		});
	});
});
