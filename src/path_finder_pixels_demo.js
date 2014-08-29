var _pf = null;
var _path = null;
var _path2 = null;
var _p_start = [ 0.3, 0.7 ];
var _p_dest = [ 6, 14 ];
var _refresh_in_progress = false;

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
	
	ctx.fillStyle = "#111";
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
			
			if (_pf.nodes.length > 0)
			{
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
			}
			
			ctx.fillRect(x * 16 + 4, y * 16 + 4, 9, 9);
		}
	}
	
	if (_path.length > 0)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.25)";
		ctx.lineWidth = 3;
		ctx.moveTo(_path[0].x * 16 + 8, _path[0].y * 16 + 8);
		for (x=0; x<_path.length; x++)
		{
			p = _path[x];
			
			ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
			ctx.fillRect(p.x * 16 + 6, p.y * 16 + 6, 5, 5);
			ctx.lineTo(p.x * 16 + 8, p.y * 16 + 8);
		}
		ctx.stroke();
	}
	
	if (_path2.length > 0)
	{
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
		ctx.lineWidth = 3;
		ctx.moveTo(_path2[0].x * 16 + 8, _path2[0].y * 16 + 8);
		for (x=0; x<_path2.length; x++)
		{
			p = _path2[x];
			
			ctx.fillStyle = "#ff0";
			ctx.fillRect(p.x * 16 + 6, p.y * 16 + 6, 5, 5);
			ctx.lineTo(p.x * 16 + 8, p.y * 16 + 8);
		}
		ctx.stroke();
	}
}

function refresh()
{
	var i, squares;
	
	if (_refresh_in_progress)
	{
		return;
	}
	
	_refresh_in_progress = true;
	
	var profiler = new Profiler();
	
	profiler.reset();
	
	profiler.startInterval("constructor");
	_pf = new PathFinderPixels();
	
	profiler.startInterval("generateData()");
	_pf.generateData(_pixels);
	
	profiler.startInterval("generateRoute()");
	//_path = _pf.generateRoute([ 0.1, 0.3 ], [ 8, 8 ]);
	//_path = _pf.generateRoute([ 0.1, 0.3 ], [ 8, 9 ]);
	_path = _pf.generateRoute(_p_start, _p_dest, 1000);
	
	if (_path)
	{
		profiler.startInterval("optimizePath()");
		_path2 = _pf.optimizePath(_path);
	}
	else
	{
		_path2 = null;
	}
	
	profiler.startInterval("drawing");
	draw_pf("canvas1");
	
	profiler.finish();
	
	var s;
	s = "";
	s += "Path finding finished.\n";
	s += "  waypoints before optimization: " + _path.length + "\n";
	s += "  final waypoints:" + _path2.length + "\n";
	s += "\n";
	s += "Profiler output:\n";
	s += profiler.getString();
	document.getElementById("messagebox1").innerHTML = s;
	
	_refresh_in_progress = false;
}

function handle_mouse_move(e)
{
	var x, y;
	
	x = Math.min(16, Math.max(0, Math.round((e.clientX - e.originalTarget.offsetLeft - 8) / 16)));
	y = Math.min(16, Math.max(0, Math.round((e.clientY - e.originalTarget.offsetTop - 8) / 16)));
	
	_p_dest = [ x, y ];
	
	refresh();
}

function init()
{
	canvas = document.getElementById("canvas1");
	canvas.onmousemove = handle_mouse_move;
	refresh();
}

window.onload = init;
