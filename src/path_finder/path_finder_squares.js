PathFinderSquares = function()
{
	// squares is an array of [ id, x, y, size/2, final, top_neighbour_id, right_neighbour_id, bottom_neighbour_id, left_neighbour_id ]
	this.squares = [];
	
	this.generateData = function(pixels)
	{
		// pixels is a two-dimensional array of integers representing the map
		//   0: unreachable
		//   1: reachable (path-findable)
		
		function squareReachabilityStatus(square)
		{
			var x, y, has_reachable, has_unreachable;
			
			has_reachable = false;
			has_unreachable = false;
			
			for (x=square[1] - square[3]; x<square[1] + square[3]; x++)
			{
				for (y=square[2] - square[3]; y<square[2] + square[3]; y++)
				{
					if (pixels[x][y] == 0 && !has_unreachable)
					{
						has_unreachable = true;
						
						if (has_reachable)
						{
							// it has both reachable and unreachable pixels
							return 1;
						}
					}
					else if (pixels[x][y] == 1 && !has_reachable)
					{
						has_reachable = true;
						
						if (has_unreachable)
						{
							// it has both reachable and unreachable pixels
							return 1;
						}
					}
				}
			}
			
			if (has_unreachable)
			{
				// has just unreachable pixels
				return 2;
			}
			
			// has just reachable pixels
			return 3;
		}
		
		var i, tmp, finished, squares, size, id, a, b, c, d, s;
		
		squares = [];
		size = pixels.length;
		id = 0;
		
		squares.push([ 0, size / 2, size / 2, size / 2, 0, -1, -1, -1, -1 ]);
		
		do
		{
			finished = true;
			for (i=0; i<squares.length; i++)
			{
				// if square is not final
				s = squares[i];
				
				if (!s[4])
				{
					tmp = squareReachabilityStatus(s);
					
					if (s[3] >= 5 || tmp == 1)
					{
							// has both reachable and unreachable pixels - divide it!
							tmp = s[3] / 2;
							a = [ id + 1, s[1] - tmp, s[2] - tmp, tmp, 0,   s[5], id + 2, id + 3,   s[8] ];
							b = [ id + 2, s[1] + tmp, s[2] - tmp, tmp, 0,   s[5],   s[6], id + 4, id + 1 ];
							c = [ id + 3, s[1] - tmp, s[2] + tmp, tmp, 0, id + 1, id + 4,   s[7],   s[8] ];
							d = [ id + 4, s[1] + tmp, s[2] + tmp, tmp, 0, id + 2,   s[6],   s[7], id + 3 ];
							squares.splice(i, 1);
							squares.push(a);
							squares.push(b);
							squares.push(c);
							squares.push(d);
							finished = false;
							id += 4;
							break;
					}
					else if (tmp == 2)
					{
						// it has just unreachable - discard this square
						squares.splice(i, 1);
						finished = false;
						break;
					}
					else
					{
						// it has just reachable pixels - this is final
						s[4] = 1;
					}
				}
			}
		}
		while (!finished);
		
		this.squares = squares;
	}
	
	this.generateRoute = function(p_start, p_dest)
	{
		var squares, square_id_start, square_id_dest;
		
		squares = this.squares;
		
		function getSquareIdByCoordinates(p)
		{
			var i;
			
			for (i=0; i<squares.length; i++)
			{
				if (squares[i][1] - squares[i][3] >= p[0] && squares[i][1] + squares[i][3] < p[0] && squares[i][2] - squares[i][3] >= p[1] && squares[i][2] + squares[i][3] < p[1])
				{
					return i;
				}
			}
			
			// outside reachable area? what?!
			return null;
		}
		
		square_id_start = getSquareIdByCoordinates(p_start);
		square_id_dest = getSquareIdByCoordinates(p_dest);
	}
}
