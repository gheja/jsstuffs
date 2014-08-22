var _world;
var _canvas;

function update()
{
	_world.generate(123);
}

function draw()
{
	var ctx = _canvas.getContext("2d");
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 640, 640);
	
	// read pointer
	for (x=0; x<_world.grid_width; x++)
	{
		for (y=0; y<_world.grid_width; y++)
		{
			if (_world.grid[x][y] > 0)
			{
				ctx.fillStyle = "rgba(255, 255, 255, " + (_world.grid[x][y]) + ")";
			}
			else
			{
				ctx.fillStyle = "rgba(128, 255, 255, " + (_world.grid[x][y] * -1) + ")";
			}
			
			ctx.fillRect(x * 10, y * 10, 10, 10);
		}
	}
}

function init()
{
	_canvas = document.getElementById("canvas1");
	_canvas.width = 640;
	_canvas.height = 640;
	
	_world = new World();
	
	update();
	draw();
}

window.onload = init;
