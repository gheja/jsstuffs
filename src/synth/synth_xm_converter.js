SynthXmConverter = function()
{
	this.log = function(s)
	{
		console.log("SynthXmConverter: " + s);
	}
	
	this.readFile = function(data)
	{
		var xm_reader = new SynthXmReader();
		
		try
		{
			return xm_reader.readFile(data);
		}
		catch (e)
		{
			this.log("Exception: " + e);
			return false;
		}
	}
}
