// ugly, but simple and useful

/** @constructor */
var AlmostRandom = function()
{
	"use strict";
	
	var _seed = 42;
	
	this.setSeed = function(seed)
	{
		_seed = seed;
	};
	
	this.random = function()
	{
		// these numbers are from random.org
		_seed = (_seed * 26031 + 35803270) % 5886503;
		
		// really.
		return (_seed % 73727) / 73727;
	};
};

module.exports = AlmostRandom;
