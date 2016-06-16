/* depends on lib/almost_random.js */

MapGenerator = function()
{
	/* grid width and height, must be multiples of two */
	this.map_size = 128;
	
	// this.map[1][2] = [
	//   element type: 0: water, 1: land, 2: forest, 3: hill, 4: starting point
	// ];
	this.map = [];
	
	this.arrayInit = function(value)
	{
		var a, x, y;
		
		a = [];
		
		for (x=0; x<=this.map_size; x++)
		{
			a[x] = [];
			
			for (y=0; y<=this.map_size; y++)
			{
				a[x][y] = value;
			}
		}
		
		return a;
	}
	
	this.generateLayer = function(seed, limit1, limit2)
	{
		// heightmap generation using random midpoint displacement,
		// starting from the corners
		
		// ---- position ---- phase  step size
		// 0 1 2 3 4 5 6 7 8
		// x               x  1      8 (=map_size)
		// .       x       .  2      4
		// .   x   .   x   .  3      2
		// . x . x . x . x .  4      1
		
		var x, y, step, max_elevation, rng, a, layer;
		
		layer = [];
		
		rng = new AlmostRandom(seed);
		
		// initialize the whole grid with default values
		layer = this.arrayInit(0.5);
		
		step = this.map_size;
		max_elevation = 1;
		
		// do the random midpoint displacement (values are not
		// guaranteed to be between 0.0 and 1.0)
		while (step > 0)
		{
			for (y=0; y<this.map_size; y+=step)
			{
				for (x=step; x<this.map_size; x+= step * 2)
				{
					layer[x][y] = (layer[x - step][y] + layer[x + step][y]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			for (x=0; x<this.map_size; x+=step)
			{
				for (y=step; y<this.map_size; y+=step * 2)
				{
					layer[x][y] = (layer[x][y - step] + layer[x][y + step]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			step = Math.floor(step / 2);
			max_elevation /= 2;
		}
		
		// finding the min and max values for normalization
		min = 1.0;
		max = 0.0;
		
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				min = Math.min(min, layer[x][y]);
				max = Math.max(max, layer[x][y]);
			}
		}
		
		// normalization and applying limits
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				// normalization to 0.0 - 1.0
				a = (layer[x][y] - min) * (1 / (max - min));
				
				// resetting value to default 0
				layer[x][y] = 0;
				
				// checking and applying the limits
				if (limit1 < limit2)
				{
					if (a >= limit1 && a <= limit2)
					{
						layer[x][y] = 1;
					}
				}
				else
				{
					if (a <= limit2 || a >= limit1)
					{
						layer[x][y] = 1;
					}
				}
			}
		}
		
		return layer;
	}
	
	this.applyLayer = function(layer, old_value, new_value)
	{
		var x, y;
		
		for (x=0; x<=this.map_size; x++)
		{
			for (y=0; y<=this.map_size; y++)
			{
				if (layer[x][y] == 1 && this.map[x][y] == old_value)
				{
					this.map[x][y] = new_value;
				}
			}
		}
	}
	
	this.generateAndApplyLayer = function(seed, range_a, range_b, old_value, new_value)
	{
		var p;
		
		p = this.generateLayer(seed, range_a / 61, range_b / 61);
		
		this.applyLayer(p, old_value, new_value);
	}
	
	this.findStartingPoints = function(seed)
	{
		var i, x, y, rng, points, found, tries;
		
		rng = new AlmostRandom(seed * 10000);
		
		found = false;
		
		points = [];
		
		tries = 0;
		
		while (!found && tries < 10000)
		{
			// generate four random points on the map
			for (i=0; i<4; i++)
			{
				points[i] = [ rng.randomInteger(0, this.map_size - 1), rng.randomInteger(0, this.map_size - 1) ];
			}
			
			found = true;
			
			// check if they are lands (not forest or water)
			for (i=0; i<4; i++)
			{
				// if one of them is not on land then these points won't work
				if (this.map[points[i][0]][points[i][1]] != 1)
				{
					found = false;
					break;
				}
			}
			
			tries++;
		}
		
		// if found valid points then we're happy
		if (found)
		{
			for (i=0; i<4; i++)
			{
				this.map[points[i][0]][points[i][1]] = 4;
			}
		}
	}
	
	this.init = function(map_size)
	{
		this.map_size = map_size;
		
		this.map = this.arrayInit(0);
	}
	
	
	
	/* for debug/dev purposes */
	this.isMapValid = function()
	{
		var x, y, count;
		
		count = 0;
		
		for (x=0; x<=this.map_size; x++)
		{
			for (y=0; y<=this.map_size; y++)
			{
				if (this.map[x][y] == 4)
				{
					count++;
				}
			}
		}
		
		if (count != 4)
		{
			return false;
		}
		
		// TODO: starting point distance check
		
		// TODO: path finder check between starting points
		
		return true;
	}
	
	this.miscGetMap = function()
	{
		var a, x, y;
		
		a = this.arrayInit(0);
		
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				a[x][y] = this.map[x][y];
			}
		}
		
		return a;
	}
	
	this.miscSetMap = function(a)
	{
		var x, y;
		
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				this.map[x][y] = a[x][y];
			}
		}
	}
}
