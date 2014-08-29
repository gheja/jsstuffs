PathFinderPixels = function()
{
	this.pixels = [];
	this.nodes = [];
	
	this.generateData = function(pixels)
	{
		this.pixels = pixels;
	}
	
	this.generateRoute = function(p_start, p_dest, step_limit)
	{
		var nodes, queue, current, steps, width, height, that;
		
		that = this;
		
		if (step_limit === undefined)
		{
			step_limit = 0xffff;
		}
		
		Node = function(x, y)
		{
			this.x = x;
			this.y = y;
			this.status = 0;
			this.parent = null;
		};
		
		function getDistance(p1, p2)
		{
			return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
			// return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
		}
		
		function checkPixel(x, y, parent)
		{
			var p;
			
			if (x >= 0 && x < width && y >= 0 && y < height && that.pixels[x][y] == 1 && nodes[x][y].status == 0)
			{
				p = nodes[x][y];
				
				p.status = 1;
				p.parent = parent;
				p.distance = getDistance([ x, y ], p_dest);
				
				queue.push(p);
			}
		}
		
		function backtrack(node)
		{
			var path = [];
			
			while (node.parent !== null)
			{
				path.push(node);
				node = node.parent;
			}
			
			return path.reverse();
		}
		
		p_start = [ Math.floor(p_start[0]), Math.floor(p_start[1]) ];
		p_end = [ Math.floor(p_dest[0]), Math.floor(p_dest[1]) ];
		steps = 0;
		queue = [ ];
		
		width = this.pixels.length;
		height = this.pixels[0].length;
		pixels = this.pixels;
		
		nodes = [];
		for (x=0; x<this.pixels.length; x++)
		{
			nodes[x] = [];
			for (y=0; y<this.pixels.length; y++)
			{
				nodes[x].push(new Node(x, y));
			}
		}
		
		// add the starting node to the queue
		tmp = nodes[p_start[0]][p_start[1]];
		tmp.distance = getDistance(p_start, p_dest);
		queue.push(tmp);
		
		steps = 0;
		var best_id = 0;
		
		while (queue.length > 0)
		{
			best = queue[0];
			for (i=0; i<queue.length; i++)
			{
				if (queue[i].distance < best.distance && queue[i].status == 1)
				{
					best = queue[i];
					best_id = i;
				}
			}
			
			queue.splice(best_id, 1);
			current = best;
			current.status = 2;
			
			if (current.x == p_dest[0] && current.y == p_dest[1])
			{
				// just for some visualization
				this.nodes = nodes;
				
				return backtrack(current);
			}
			
			checkPixel(current.x - 1, current.y, current);
			checkPixel(current.x + 1, current.y, current);
			checkPixel(current.x, current.y - 1, current);
			checkPixel(current.x, current.y + 1, current);
			
			checkPixel(current.x - 1, current.y - 1, current);
			checkPixel(current.x - 1, current.y + 1, current);
			checkPixel(current.x + 1, current.y - 1, current);
			checkPixel(current.x + 1, current.y + 1, current);
			
			if (++steps == step_limit)
			{
				return null;
			}
		}
		
		return null;
	}
	
	this.optimizePath = function(path)
	{
		var new_path, that, i, last;
		
		that = this;
		
		function isReachable(p1, p2)
		{
			var dx, dy, steps, i;
			
			dx = p2.x - p1.x;
			dy = p2.y - p1.y;
			
			steps = Math.max(dx, dy) * 5;
			dx /= steps;
			dy /= steps;
			
			for (i=0; i<steps; i++)
			{
				x = Math.round(p1.x + dx * i);
				y = Math.round(p1.y + dy * i);
				
				if (that.pixels[x][y] != 1)
				{
					return false;
				}
			}
			
			return true;
		}
		
		new_path = [];
		last = path[0];
		
		for (i=0; i<path.length - 1; i++)
		{
			if (!isReachable(last, path[i + 1]))
			{
				new_path.push(last);
				last = path[i];
			}
		}
		
		new_path.push(last);
		new_path.push(path[path.length - 1]);
		
		return new_path;
	}
}
