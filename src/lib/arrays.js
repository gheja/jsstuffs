/** @constructor */
var ArbitaryArray = function(a, b)
{
	"use strict";
	
	this.array = a ? a : [];
	this.multiplier = b ? b : 256;
	this.pointer = 0;
	
	this.add = function(value)
	{
		this.array.push(value);
	};
	
	this.readOne = function()
	{
		return this.array[this.pointer++];
	};
	
	this.readTwo = function()
	{
		return this.array[this.pointer++] + this.array[this.pointer++] * this.multiplier;
	};
	
	this.eof = function()
	{
		return this.pointer >= this.array.length;
	};
	
	this.seek = function(i)
	{
		this.pointer = i;
	};
	
	this.getAsUint8Array = function()
	{
		return new Uint8Array(this.array);
	};
	
	this.getAsUint16Array = function()
	{
		return new Uint16Array(this.array);
	};
};
