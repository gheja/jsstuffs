PathFinderPolygon = function()
{
	this.polygons = []; // [ [ p1, p2, p3 ], ... ]
	this.lines = [];
	
	this.addPolygon = function(points)
	{
		this.polygons.push(points);
	}
	
	this.createLines = function()
	{
		var i, j, k, l, m, valid;
		
		function isOnEnd(p, q, r)
		{
			return (q[0] == p[0] && q[1] == p[1]) || (q[0] == r[0] && q[1] == r[1])
		}
		
		function isOnSegment(p, q, r)
		{
			return q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) && q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1])
		}
		
		function getOrientation(p, q, r)
		{
			var val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
			
			if (val == 0)
			{
				return 0;
			}
			
			if (val > 0)
			{
				return 1;
			}
			
			return 2;
		}
		
		function doIntersect(p1, q1, p2, q2)
		{
			var o1, o2, o3, o4;
			
			if (isOnEnd(p1, p2, q1) || isOnEnd(p1, q2, q1) || isOnEnd(p2, p1, q2) || isOnEnd(p2, q1, q2))
			{
				return false;
			}
			
			o1 = getOrientation(p1, q1, p2);
			o2 = getOrientation(p1, q1, q2);
			o3 = getOrientation(p2, q2, p1);
			o4 = getOrientation(p2, q2, q1);
			
			if (o1 != o2 && o3 != o4)
			{
				return true;
			}
			
			if (o1 == 0 && isOnSegment(p1, p2, q1))
			{
				return true;
			}
			
			if (o2 == 0 && isOnSegment(p1, q2, q1))
			{
				return true;
			}
			
			if (o3 == 0 && isOnSegment(p2, p1, q2))
			{
				return true;
			}
			
			if (o4 == 0 && isOnSegment(p2, q1, q2))
			{
				return true;
			}
			
			return false;
		}
		
		function doIntersectPolygon(p1, q1, polygon)
		{
			var i;
			
			for (i=0; i < polygon.length - 1; i++)
			{
				if (doIntersect(p1, q1, polygon[i], polygon[i + 1]))
				{
					return true;
				}
			}
			
			if (doIntersect(p1, q1, polygon[i], polygon[0]))
			{
				return true;
			}
			
			return false;
		}
				this.lines = [];
		
		for (i=0; i<this.polygons.length; i++)
		{
			for (j=0; j<this.polygons[i].length; j++)
			{
				// for (k=0; k<this.polygons.length; k++)
				for (k=i+1; k<this.polygons.length; k++)
				{
					for (l=0; l<this.polygons[k].length; l++)
					{
						valid = true;
						
						for (m=0; m<this.polygons.length; m++)
						{
							if (doIntersectPolygon(this.polygons[i][j], this.polygons[k][l], this.polygons[m]))
							{
								valid = false;
								break;
							}
						}
						
						if (valid)
						{
							this.lines.push([ this.polygons[i][j], this.polygons[k][l] ]);
						}
					}
				}
			}
		}
	}
}
