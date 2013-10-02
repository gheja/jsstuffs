/** @constructor */
var ArbitaryArray = function(a, b)
{
	"use strict";
	
	var _array = a ? a : [];
	var _multiplier = b ? b : 256;
	var _pointer = 0;
	
	this.add = function(value)
	{
		_array.push(value);
	};
	
	this.readOne = function()
	{
		return _array[_pointer++];
	};
	
	this.readTwo = function()
	{
		return _array[_pointer++] + _array[_pointer++] * _multiplier;
	};
	
	this.eof = function()
	{
		return _pointer >= _array.length;
	};
	
	this.seek = function(i)
	{
		_pointer = i;
	};
	
	this.getAsUint8Array = function()
	{
		return new Uint8Array(_array);
	};
	
	this.getAsUint16Array = function()
	{
		return new Uint16Array(_array);
	};
};

module.exports = ArbitaryArray;
