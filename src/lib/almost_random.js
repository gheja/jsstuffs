// ugly, but simple and useful

/** @construct */
AlmostRandom = function()
{
	this.seed = 42;
	
	this.setSeed = function(seed)
	{
		this.seed = seed;
	}
	
	this.random = function()
	{
		// these numbers are from random.org
		this.seed = (this.seed * 26031 + 35803270) % 5886503;
		
		// really.
		return (this.seed % 73727) / 73727;
	}
}
