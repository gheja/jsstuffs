/**
  * @module almost_random
  */

/**
  * This is simple, ugly but really useful PRNG. The random numbers are always
  * predictable from the seed so two sequence of random numbers are guaranteed
  * to be the same if the same seed is used - useful for simulations and
  * debugging purposes.
  *
  * @constructor
  * @class AlmostRandom
  * @param {number} seed (optional) initial seed
  */
AlmostRandom = function()
{
	/** @private {number} */ this.seed = 42;
	
	/**
	  * Set the seed for a specified value
	  *
	  * @method setSeed
	  * @param {number} seed the seed wanted
	  */
	this.setSeed = function(seed)
	{
		this.seed = seed;
	}
	
	/**
	  * Returns a "random" float between 0.0 and 1.0.
	  *
	  * @method setSeed
	  * @returns {number} the generated random number
	  */
	this.random = function()
	{
		// these numbers are from random.org
		this.seed = (this.seed * 26031 + 35803270) % 5886503;
		
		// really.
		return (this.seed % 73727) / 73727;
	}
}
