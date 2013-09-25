var assert = require('assert');

atob = require("atob");
btoa = require("btoa");
require('../src/lib/base64.js');

describe('base64_encode()', function() {
	it('without trailing "=" characters', function () {
		var result = base64_encode([ 32, 33, 34 ]);
		assert.equal(result, "ICEi");
	});
	it('with trailing "=" characters', function () {
		var result = base64_encode([ 32, 33, 34, 35 ]);
		assert.equal(result, "ICEiIw==");
	});
});

describe('base64_decode()', function() {
	it('without trailing "=" characters', function () {
		var result = base64_decode("ICEi");
		assert.deepEqual(result, [ 32, 33, 34 ]);
	});
	it('with trailing "=" characters', function () {
		var result = base64_decode("ICEiIw==");
		assert.deepEqual(result, [ 32, 33, 34, 35 ]);
	});
});

describe('base64_to_int16array()', function() {
	it('without trailing "=" characters', function () {
		var result = base64_to_int16array("ABCDEF");
		assert.equal(result[0], 4096);
		assert.equal(result[1], 4227);
	});
	it('with trailing "=" characters', function () {
		var result = base64_to_int16array("ABCDEFGH=");
		assert.equal(result[0], 4096);
		assert.equal(result[1], 4227);
		assert.equal(result[2], -30895);
	});
});
