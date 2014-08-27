var _pf = null;

function draw_pf(canvas_name, mode)
{
	var x, y, ctx, x_multiplier, y_multiplier, sea_level, coast_x;
	
	canvas = document.getElementById(canvas_name);
	
	ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#111111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// ctx.fillStyle = "#aaaaaa";
	// ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
	
	ctx.strokeStyle = "#0066ee";
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (i=0; i<_pf.polygons.length; i++)
	{
		ctx.moveTo(_pf.polygons[i][0][0], _pf.polygons[i][0][1]);
		
		for (j=1; j<_pf.polygons[i].length; j++)
		{
			ctx.lineTo(_pf.polygons[i][j][0], _pf.polygons[i][j][1]);
		}
		ctx.closePath();
		ctx.stroke();
	}
	
	ctx.strokeStyle = "#00bb00";
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (i=0; i<_pf.lines.length; i++)
	{
		ctx.moveTo(_pf.lines[i][0][0], _pf.lines[i][0][1]);
		ctx.lineTo(_pf.lines[i][1][0], _pf.lines[i][1][1]);
		ctx.stroke();
	}
}

function init()
{
	var i;
	
	var profiler = new Profiler();
	
	profiler.reset();
	
	profiler.startInterval("constructor");
	
	_pf = new PathFinderPolygon();
	
	profiler.startInterval("addPolygon()");
	_pf.addPolygon([ [ 20, 20 ], [ 300, 10 ], [ 700, 40 ], [ 800, 150 ], [ 950, 390 ], [ 630, 330 ],[ 600, 270 ], [ 410, 370 ], [ 60, 320 ] ]);
	// _pf.addPolygon([ [ 20, 20 ], [ 300, 20 ], [ 300, 300 ], [ 20, 300 ] ]);
	_pf.addPolygon([ [ 100, 40 ], [ 200, 40 ], [ 200, 170 ], [ 100, 170 ] ]);
	_pf.addPolygon([ [ 180, 200 ], [ 250, 200 ], [ 250, 270 ], [ 180, 270 ] ]);
	
	/*
	for (i = 0; i<10; i++)
	{
		_pf.addPolygon([ [ 10 + i * 20, 20 ], [ 15 + i * 20, 20 ], [ 15 + i * 20, 50 ], [ 10 + i * 20, 50 ] ]);
	}
	*/
	
	profiler.startInterval("createLines()");
	_pf.createLines();
	
	draw_pf("canvas1");
	profiler.startInterval("draw");
	
	profiler.finish();
	
	profiler.dump();
}

window.onload = init;
