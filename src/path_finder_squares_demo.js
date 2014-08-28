var _pf = null;
/*
var _pixels = [
	[ 1, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 1, 0, 0, 1, 1, 1, 1 ],
	[ 1, 1, 0, 0, 1, 1, 1, 1 ],
	[ 1, 0, 0, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 0, 0, 0, 0 ],
	[ 1, 1, 1, 1, 1, 1, 0, 1 ],
	[ 1, 1, 1, 1, 0, 1, 1, 1 ]
];
*/

var _pixels = [
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1 ],
	[ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
	[ 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1 ]
];

function draw_pf(canvas_name, mode)
{
	var x, y, ctx, x_multiplier, y_multiplier, sea_level, coast_x;
	
	canvas = document.getElementById(canvas_name);
	
	ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#222222";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	for (x=0; x<_pixels.length; x++)
	{
		for (y=0; y<_pixels.length; y++)
		{
			if (_pixels[x][y])
			{
				ctx.fillStyle = "#060";
				ctx.fillRect(x * 16 + 1, y * 16 + 1, 15, 15);
			}
			else
			{
				ctx.fillStyle = "#333";
				ctx.fillRect(x * 16 + 1, y * 16 + 1, 15, 15);
			}
		}
	}
	
	for (x=0; x<_pf.squares.length; x++)
	{
		p = _pf.squares[x];
		
		ctx.fillStyle = "rgba(0, 255, 0, 0.25)";
		ctx.fillRect((p[1] - p[3]) * 16 + 3, (p[2] - p[3]) * 16 + 3, p[3] * 2 * 16 - 5, p[3] * 2 * 16 - 5);
		
		ctx.fillStyle = "#0c0";
		ctx.fillRect(p[1] * 16 - 1, p[2] * 16 - 1, 3, 3);
	}
	
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
	ctx.lineWidth = 3;
	for (x=0; x<_pf.links.length; x++)
	{
		for (i=0; i<_pf.squares.length; i++)
		{
			if (_pf.squares[i][0] == _pf.links[x][0])
			{
				p = _pf.squares[i];
			}
			else if (_pf.squares[i][0] == _pf.links[x][1])
			{
				q = _pf.squares[i];
			}
		}
		
		ctx.moveTo(p[1] * 16, p[2] * 16);
		ctx.lineTo(q[1] * 16, q[2] * 16);
	}
	ctx.stroke();
}

function init()
{
	var i, squares;
	
	var profiler = new Profiler();
	
	profiler.reset();
	
	profiler.startInterval("constructor");
	_pf = new PathFinderSquares();
	
	profiler.startInterval("generateData()");
	_pf.generateData(_pixels);
	
	profiler.startInterval("generateRoute()");
	_pf.generateRoute(0.1, 0.3, 12, 14);
	
	profiler.startInterval("drawing");
	draw_pf("canvas1");
	
	profiler.finish();
	profiler.dump();
}

window.onload = init;
