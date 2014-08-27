Profiler = function()
{
	this.intervals = [];
	this.events = [];
	this.start_time = 0;
	this.total_run_time = 0;
	
	this.reset = function()
	{
		this.intervals = [];
		this.events = [];
		this.start_time = (new Date()).getTime();
	}
	
	this.getTimestamp = function()
	{
		return ((new Date()).getTime() - this.start_time);
	}
	
	this.startInterval = function(interval_name)
	{
		var now;
		
		now = this.getTimestamp();
		if (this.intervals.length > 0)
		{
			this.intervals[this.intervals.length - 1][1] = now;
		}
		this.intervals.push([ now, 0, interval_name ]);
	}
	
	this.registerEvent = function(event_name)
	{
		this.events.push([ this.getTimestamp(), event_name ]);
	}
	
	this.finish = function()
	{
		var now;
		
		now = this.getTimestamp();
		
		this.total_run_time = now;
		
		if (this.intervals.length > 0)
		{
			this.intervals[this.intervals.length - 1][1] = now;
		}
	}
	
	this.padString = function(x, length)
	{
		var s;
		
		s = x.toString();
		
		while (s.length < length)
		{
			s = " " + s;
		}
		
		return s;
	}
	
	this.dump = function()
	{
		var i;
		
		console.log("***");
		
		for (i=0; i<this.intervals.length; i++)
		{
			a = this.intervals[i];
			console.log(this.padString(a[0], 6) + "ms " + this.padString("+" + (a[1] - a[0]), 7) + "ms " + this.padString(Math.floor(100 * (a[1] - a[0]) / this.total_run_time) + "%", 5) + ": " + a[2]);
		}
		
		console.log(this.padString(this.total_run_time, 6) + "ms (finished)");
		
		for (i=0; i<this.events.length; i++)
		{
			a = this.events[i];
			console.log(a[0] + " " + a[1]);
		}
	}
}
