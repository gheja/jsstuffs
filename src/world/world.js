/* depends on lib/almost_random.js */

World = function()
{
	/* grid width and height, must be multiples of two */
	this.map_size = 128;
	
	// 2d array with X Y Z coordinates, land type and lighting info, must be ordered by the X and Y coordinates!
	// this.map[1][2] = [
	//   1.097,  // X coordinate (float)
	//   2.121,  // Y coordinate (float)
	//   0.982,  // Z coordinate (float, 0.0-1.0)
	//   1,      // point type (int, 1: water, 2: land)
	//   0.4,    // lighting info (float, 0.0: darkest, 1.0: brightest)
	//   1       // path-finding info (0: unreachable, 1: reachable)
	// ];
	this.map = [];
	this.starting_points = [];
	
	this.genGenerateHeightmap = function(seed)
	{
		// heightmap generation using random midpoint displacement
		
		// 0 1 2 3 4 5 6 7 8
		// x               x - init
		// .       x       . - 4
		// .   x   .   x   . - 2
		// . x . x . x . x . - 1
		
		var x, y, step, max_elevation, rng;
		
		rng = new AlmostRandom(seed);
		
		// initialize the grid with default values
		for (x=0; x<=this.map_size; x++)
		{
			this.map[x] = [];
			
			for (y=0; y<=this.map_size; y++)
			{
				this.map[x][y] = [ x, y, 0.5, 2, 0, 0 ];
			}
		}
		
		step = this.map_size;
		max_elevation = 1;
		
		while (step > 0)
		{
			for (y=0; y<this.map_size; y+=step)
			{
				for (x=step; x<this.map_size; x+= step * 2)
				{
					this.map[x][y][2] = (this.map[x - step][y][2] + this.map[x + step][y][2]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			for (x=0; x<this.map_size; x+=step)
			{
				for (y=step; y<this.map_size; y+=step * 2)
				{
					this.map[x][y][2] = (this.map[x][y - step][2] + this.map[x][y + step][2]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			step = Math.floor(step / 2);
			max_elevation /= 2;
		}
		
		// normalization
		min = 1.0;
		max = 0.0;
		
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				min = Math.min(min, this.map[x][y][2]);
				max = Math.max(max, this.map[x][y][2]);
			}
		}
		
		for (x=0; x<this.map_size; x++)
		{
			for (y=0; y<this.map_size; y++)
			{
				this.map[x][y][2] = (this.map[x][y][2] - min) * (1 / (max - min));
			}
		}
	}
	
	this.genFixHeightmap = function(seed)
	{
		// heightmap correction
		
		var x, y, i, points, distance, rng;
		
		rng = new AlmostRandom(seed);
		
		points = [];
		for (i=0; i<rng.random() * 5 + 5; i++)
		{
			points.push([ rng.random() * 0.1 + 0.45, rng.random() * 0.1 + 0.45 ]);
		}
		
		for (x=0; x<=this.map_size; x++)
		{
			for (y=0; y<=this.map_size; y++)
			{
				distance = 1;
				for (i=0; i<points.length; i++)
				{
					distance = Math.min(distance, distance_2d([x / this.map_size, y / this.map_size], points[i]));
				}
				
				distance = clamp(1 - distance * 2, 0, 1);
				
				this.map[x][y][2] = this.map[x][y][2] * distance;
			}
		}
	}
	
	this._floodFill = function(map, search_index, search_min, search_max, set_index, set_value, start_points)
	{
		// thanks @williammalone
		// http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
		
		var x, y, queue, item, found_left, found_right, size, match_count;
		
		// width and height must be identical!
		size = map[0].length;
		
		function test(x, y)
		{
			return map[x][y][search_index] >= search_min && map[x][y][search_index] <= search_max && map[x][y][set_index] != set_value;
		}
		
		queue = start_points;
		
		match_count = 0;
		
		while (queue.length > 0)
		{
			item = queue.pop();
			x = item[0];
			y = item[1];
			found_left = false;
			found_right = false;
			
			while (y > 0 && test(x, y - 1))
			{
				y--;
			}
			
			while (y < size && test(x, y))
			{
				if (x - 1 > 0)
				{
					if (!found_left)
					{
						if (test(x - 1, y))
						{
							found_left = true;
							queue.push([ x - 1, y ]);
						}
					}
					else
					{
						if (!test(x - 1, y))
						{
							found_left = false;
						}
					}
				}
				
				if (x + 1 < size)
				{
					if (!found_right)
					{
						if (test(x + 1, y))
						{
							found_right = true;
							queue.push([ x + 1, y ]);
						}
					}
					else
					{
						if (!test(x + 1, y))
						{
							found_right = false;
						}
					}
				}
				
				map[x][y][set_index] = set_value;
				match_count++;
				
				y++;
			}
		}
		
		return match_count;
	}
	
	this.genFloodFill = function(sea_level)
	{
		// start a flood fill from point [ 0, 0 ], search for heights between 0 and sea_level, set them as water
		this._floodFill(this.map, 2, 0.0, sea_level, 3, 1, [ [ 0, 0 ] ]);
	}
	
	this.genGenerateLightmap = function()
	{
		// fake lighting calculation
		
		var x, y, i, j, avg1, a, b, c, d;
		
		// these determines the direction of light
		a = Math.floor(this.map_size / 64);
		b = Math.floor(this.map_size / 16);
		c = Math.floor(this.map_size / 32);
		d = Math.floor(this.map_size / 32);
		
		for (x=a; x<this.map_size-b; x++)
		{
			for (y=c; y<this.map_size-d; y++)
			{
				avg1 = 0;
				
				for (i=-a; i<=b; i++)
				{
					for (j=-c; j<=d; j++)
					{
						avg1 += this.map[x + i][y + j][2];
					}
				}
				
				avg1 = avg1 / ((a+b+1) * (c+d+1));
				
				this.map[x][y][4] = this.map[x][y][2] - avg1;
			}
		}
	}
	
	this.genGeneratePathFinderData = function(seed)
	{
		var i, points_matched, p, a, rng;
		
		rng = new AlmostRandom(seed);
		
		// retry 30 times at most
		for (i=0; i<30; i++)
		{
			p = [ Math.floor(rng.random() * this.map_size), Math.floor(rng.random() * this.map_size) ];
			
			a = deep_copy_object(this.map);
			
			// start a flood fill from a point, search for lands, set them as reachable
			points_matched = this._floodFill(a, 3, 2, 2, 5, 1, [ p ]);
			
			// 25% of the map should be playable at least
			if (points_matched / (this.map_size * this.map_size) > 0.25)
			{
				this.map = a;
				return true;
			}
		}
		
		return false;
	}
	
	this.genGenerateStartingPoints = function(seed)
	{
		var i, candidates, best_min_sum, min_sum, min, best_id, p, a, rng, success;
		
		rng = new AlmostRandom(seed);
		
		success = false;
		
		for (i=0; i < 200 && success == false; i++)
		{
			candidates = [];
			
			// make sure that no one is near the middle of the map
			candidates.push([ this.map_size / 2, this.map_size / 2 ]);
			
			for (j=0; j<100; j++)
			{
				// find a point on the reachable surface
				do
				{
					p = [ Math.floor(rng.random()* this.map_size), Math.floor(rng.random() * this.map_size) ];
				}
				while (this.map[p[0]][p[1]][5] != 1);
				
				min = 1000;
				for (k=0; k<candidates.length; k++)
				{
					min = Math.min(min, distance_2d(candidates[k], p));
				}
				
				if (min > 32)
				{
					candidates.push(p);
					
					if (candidates.length == 5)
					{
						success = true;
						break;
					}
				}
			}
		}
		
		// remove the first item
		candidates.shift();
		
		this.starting_points = candidates;
	}
	
	this.generate = function(seed, sea_level, coast_x)
	{
		// the order matters!
		this.genGenerateHeightmap(seed);
		this.genFixHeightmap(seed);
		this.genFloodFill(sea_level);
		this.genGeneratePathFinderData(seed);
		this.genGenerateStartingPoints(seed);
		this.genGenerateLightmap();
	}
}
