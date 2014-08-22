/* depends on lib/almost_random.js */

World = function()
{
	this.grid_width = 64; // must be multiples of two!
	this.grid_height = 64; // must be multiples of two!
	
	// 2d array with X Y Z coordinates, must be ordered by the X and Y coordinates!
	// this.grid[1][2] = [ 0.123, 0. 324, 0.123 ];
	this.grid = [];
	
	// 0 1 2 3 4 5 6 7 8
	// x               x - init
	// .       x       . - 4
	// .   x   .   x   . - 2
	// . x . x . x . x . - 1
	
	this.generate = function(seed)
	{
		var x, y, step, max_elevation, rng;
		
		rng = new AlmostRandom(seed);
		
		// initialize the map with zeroes
		for (x=0; x<=this.grid_width; x++)
		{
			this.grid[x] = [];
			
			for (y=0; y<=this.grid_width; y++)
			{
				this.grid[x][y] = 0;
			}
		}
		
		step = 16;
		max_elevation = 10;
		
		while (step > 0)
		{
			for (y=0; y<this.grid_height; y+=step)
			{
				for (x=step; x<this.grid_width; x+= step)
				{
					this.grid[x][y] = (this.grid[x - step][y] + this.grid[x + step][y]) / 2 + (rng.random() * max_elevation - max_elevation / 2);
				}
			}
			
			for (x=0; x<this.grid_width; x+=step)
			{
				for (y=step; y<this.grid_height; y+=step)
				{
					this.grid[x][y] = (this.grid[x][y - step] + this.grid[x][y + step]) / 2 + (rng.random() * max_elevation - max_elevation / 2);
				}
			}
			
			step = Math.floor(step / 2);
			max_elevation /= 2;
		}
	}
}
