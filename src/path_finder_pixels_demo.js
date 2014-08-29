var _pf = null;
var _path = null;

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
			
			switch (_pf.nodes[x][y].status)
			{
				case 0:
				break;
				case 1:
					ctx.fillStyle = "#0c9";
				break;
				case 2:
					ctx.fillStyle = "#086";
				break;
			}
			
			ctx.fillRect(x * 16 + 4, y * 16 + 4, 9, 9);
		}
	}
	
	if (_path != null)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
		ctx.lineWidth = 3;
		ctx.moveTo(_path[0].x * 16 + 8, _path[0].y * 16 + 8);
		for (x=0; x<_path.length; x++)
		{
			p = _path[x];
			
			ctx.fillStyle = "#fff";
			ctx.fillRect(p.x * 16 + 6, p.y * 16 + 6, 5, 5);
			ctx.lineTo(p.x * 16 + 8, p.y * 16 + 8);
		}
		ctx.stroke();
	}
}

function init()
{
	var i, squares;
	
	var profiler = new Profiler();
	
	profiler.reset();
	
	profiler.startInterval("constructor");
	_pf = new PathFinderPixels();
	
	profiler.startInterval("generateData()");
	_pf.generateData(_pixels);
	
	profiler.startInterval("generateRoute()");
	//_path = _pf.generateRoute([ 0.1, 0.3 ], [ 8, 8 ]);
	//_path = _pf.generateRoute([ 0.1, 0.3 ], [ 8, 9 ]);
	_path = _pf.generateRoute([ 0.1, 0.3 ], [ 6, 14 ]);
	
	profiler.startInterval("drawing");
	draw_pf("canvas1");
	
	profiler.finish();
	profiler.dump();
}

window.onload = init;
