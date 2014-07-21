/**
  * @module Gl
  */

/**
  * @constructor
  * @class Gl
  */
Gl = (function(canvas)
{
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("experimental-webgl");
	if (!this.ctx)
	{
		return false;
	}
	
	this.ctx.enable(this.ctx.DEPTH_TEST);
	this.ctx.depthFunc(this.ctx.LEQUAL);
	this.ctx.clearColor(0, 0, 0, 1.0);
	this.start_time = 0;
	this.time = 0;
	this.frame_number = 0;
	
	this.renderFrame = function()
	{
		var now = (new Date()).getTime() / 1000;
		this.time = now - this.start_time;
		
		this.ctx.clearColor(0.2, 0.4, 0.3 + (this.time * 100 % 70) / 100, 1.0);
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
		
		this.frame_number++;
		this.last_frame_time = now;
		
		window.requestAnimFrame(this.renderFrame.bind(this));
	}
	
	this.resize = function()
	{
		this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.start = function()
	{
		this.frame_number = 0;
		this.start_time = (new Date()).getTime() / 1000;
		this.renderFrame();
	}
	
});
