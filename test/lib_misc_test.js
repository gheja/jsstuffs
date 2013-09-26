var assert = require('assert');

require('../src/lib/misc.js');

describe('lib/misc.js', function() {
	describe('clamp()', function() {
		it('clamp(0.5, 0, 1) == 0.5', function () {
			var result = clamp(0.5, 0, 1);
			assert.equal(result, 0.5);
		});
		it('clamp(-0.5, 0, 1) == 0', function () {
			var result = clamp(-0.5, 0, 1);
			assert.equal(result, 0);
		});
		it('clamp(1.5, 0, 1) == 1', function () {
			var result = clamp(1.5, 0, 1);
			assert.equal(result, 1);
		});
	});
});
