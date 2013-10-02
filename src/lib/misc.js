/** @constructor */
var Lib = function()
{
	"use strict";
	
	this.clamp = function(a, b, c)
	{
		return Math.min(Math.max(a, b), c);
	};
	
	this.clampAndRoundUint8 = function(a)
	{
		return this.clamp(a | 0, 0, 255);
	};
	
	this.clampAndRoundInt16 = function(a)
	{
		return this.clamp(a | 0, -32768, 32767);
	};
};
