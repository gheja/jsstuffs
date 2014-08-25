/* depends on lib/almost_random.js */

World = function()
{
	this.grid_width = 128; // must be multiples of two!
	this.grid_height = 128; // must be multiples of two!
	
	// 2d array with X Y Z coordinates, land type and lighting info, must be ordered by the X and Y coordinates!
	// this.grid[1][2] = [
	//   1.097,  // X coordinate (float)
	//   2.121,  // Y coordinate (float)
	//   0.982,  // Z coordinate (float, 0.0-1.0)
	//   1,      // point type (int, 1: water, 2: land)
	//   0.4     // lighting info (float, 0.0: darkest, 1.0: brightest)
	// ];
	this.grid = [];
	
	this.generate_step1 = function(seed)
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
		for (x=0; x<=this.grid_width; x++)
		{
			this.grid[x] = [];
			
			for (y=0; y<=this.grid_width; y++)
			{
				this.grid[x][y] = [ x, y, 0.5, 2, 0 ];
			}
		}
		
		step = this.grid_width;
		max_elevation = 1;
		
		while (step > 0)
		{
			for (y=0; y<this.grid_height; y+=step)
			{
				for (x=step; x<this.grid_width; x+= step * 2)
				{
					this.grid[x][y][2] = (this.grid[x - step][y][2] + this.grid[x + step][y][2]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			for (x=0; x<this.grid_width; x+=step)
			{
				for (y=step; y<this.grid_height; y+=step * 2)
				{
					this.grid[x][y][2] = (this.grid[x][y - step][2] + this.grid[x][y + step][2]) / 2 + (rng.random() - 0.5) * max_elevation;
				}
			}
			
			step = Math.floor(step / 2);
			max_elevation /= 2;
		}
		
		// normalization
		min = 1.0;
		max = 0.0;
		
		for (x=0; x<this.grid_width; x++)
		{
			for (y=0; y<this.grid_height; y++)
			{
				min = Math.min(min, this.grid[x][y][2]);
				max = Math.max(max, this.grid[x][y][2]);
			}
		}
		
		for (x=0; x<this.grid_width; x++)
		{
			for (y=0; y<this.grid_height; y++)
			{
				this.grid[x][y][2] = (this.grid[x][y][2] - min) * (1 / (max - min));
			}
		}
	}
	
	this.generate_step2 = function(seed)
	{
		// heightmap correction
		
		var x, y, i, points, distance, rng;
		
		rng = new AlmostRandom(seed);
		
		points = [];
		for (i=0; i<rng.random() * 10 + 3; i++)
		{
			points.push([ rng.random() * 0.1 + 0.45, rng.random() * 0.1 + 0.45 ]);
		}
		
		for (x=0; x<=this.grid_width; x++)
		{
			for (y=0; y<=this.grid_width; y++)
			{
				distance = 1;
				for (i=0; i<points.length; i++)
				{
					distance = Math.min(distance, distance_2d([x / this.grid_width, y / this.grid_height], points[i]));
				}
				
				this.grid[x][y][2] = clamp(this.grid[x][y][2] - distance, 0, 1);
			}
		}
	}
	
	this.generate_step3 = function(sea_level)
	{
		// flood fill
		
		// TODO: rewrite this as this is pretty slow...
		
		var x, y, i, queue, seen, sea_level, a;
		
		Queue = function (){
			this.seen_list = [];
			this.items = [];
			
			this.pushIfNotSeen = function(item)
			{
				var a;
				
				a = item[0] + "," + item[1];
				
				if (this.seen_list.indexOf(a) != -1)
				{
					return;
				}
				
				this.items.push(item);
				this.seen_list.push(a);
			}
		};
		
		queue = new Queue();
		queue.pushIfNotSeen([ 0, 0 ]);
		
		seen = [];
		
		while (queue.items.length > 0)
		{
			a = Math.max(a, queue.items.length);
			
			item = queue.items.shift();
			
			// land
			if (this.grid[item[0]][item[1]][2] > sea_level)
			{
				// return if reached the land, no neighbour seek needed
				continue;
			}
			// coast
			else
			{
				this.grid[item[0]][item[1]][3] = 1;
			}
			
			if (item[0] > 0)
			{
				queue.pushIfNotSeen([ item[0] - 1, item[1] ]);
			}
			
			if (item[0] < this.grid_width - 1)
			{
				queue.pushIfNotSeen([ item[0] + 1, item[1] ]);
			}
			
			if (item[1] > 0)
			{
				queue.pushIfNotSeen([ item[0], item[1] - 1]);
			}
			
			if (item[1] < this.grid_height - 1)
			{
				queue.pushIfNotSeen([ item[0], item[1] + 1 ]);
			}
		}
	}
	
	this.generate_step3_quick = function(sea_level)
	{
		// thanks @williammalone
		// http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
		
		var that, x, y, queue, item, found_left, found_right;
		
		that = this;
		
		function test(x, y)
		{
			return that.grid[x][y][2] < sea_level && that.grid[x][y][3] == 2;
		}
		
		queue = [ [ 0, 0 ] ];
		
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
			
			while (y < this.grid_height && test(x, y))
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
				
				if (x + 1 < this.grid_width)
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
				
				if (this.grid[x][y][2] < sea_level)
				{
					this.grid[x][y][3] = 1;
				}
				
				y++;
			}
		}
	}
	
	this.generate_step4 = function()
	{
		// fake lighting calculation
		
		var x, y, i, j, avg1, a, b, c, d;
		
		// these determines the direction of light
		a = Math.floor(this.grid_width / 64);
		b = Math.floor(this.grid_width / 16);
		c = Math.floor(this.grid_height / 32);
		d = Math.floor(this.grid_height / 32);
		
		for (x=a; x<this.grid_width-b; x++)
		{
			for (y=c; y<this.grid_height-d; y++)
			{
				avg1 = 0;
				
				for (i=-a; i<=b; i++)
				{
					for (j=-c; j<=d; j++)
					{
						avg1 += this.grid[x + i][y + j][2];
					}
				}
				
				avg1 = avg1 / ((a+b+1) * (c+d+1));
				
				this.grid[x][y][4] = this.grid[x][y][2] - avg1;
			}
		}
	}
	
	this.generate = function(seed, sea_level, coast_x)
	{
		this.generate_step1(seed);
		this.generate_step2(seed);
		this.generate_step3_quick(sea_level, coast_x);
	}
}
