var assert = require('assert');

atob = require("atob");
btoa = require("btoa");
var Base64 = require('../src/lib/base64.js');

describe('Base64 encoding', function() {
	var obj = null;
	
	describe('<constructor>', function() {
		it('should not throw an error', function () {
			obj = new Base64();
		});
	});
	describe('base64_encode()', function() {
		it('without trailing "=" characters', function () {
			var result = obj.encode([ 32, 33, 34 ]);
			assert.equal(result, "ICEi");
		});
		it('with trailing "=" characters', function () {
			var result = obj.encode([ 32, 33, 34, 35 ]);
			assert.equal(result, "ICEiIw==");
		});
	});
	
	describe('base64_decode()', function() {
		it('without trailing "=" characters', function () {
			var result = obj.decode("ICEi");
			assert.deepEqual(result, [ 32, 33, 34 ]);
		});
		it('with trailing "=" characters', function () {
			var result = obj.decode("ICEiIw==");
			assert.deepEqual(result, [ 32, 33, 34, 35 ]);
		});
	});
	
	describe('base64_to_int16array()', function() {
		it('without trailing "=" characters', function () {
			var result = obj.toInt16Array("ABCDEF");
			assert.equal(result[0], 4096);
			assert.equal(result[1], 4227);
		});
		it('with trailing "=" characters', function () {
			var result = obj.toInt16Array("ABCDEFGH=");
			assert.equal(result[0], 4096);
			assert.equal(result[1], 4227);
			assert.equal(result[2], -30895);
		});
	});
});
