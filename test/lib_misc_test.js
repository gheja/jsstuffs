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
});
