var _world = null;
// var _seed = 5891;
var _seed = Math.floor(Math.random() * 65535);
var _sea_level = 0.20;
var _coast_x = 0.03;

function interpolate(a, b, f)
{
	return a + (b - a) * f;
}

function rgb_interpolate(r1, g1, b1, r2, g2, b2, f)
{
	return Math.floor(interpolate(r1, r2, f)) + "," + Math.floor(interpolate(g1, g2, f)) + "," + Math.floor(interpolate(b1, b2, f));
}

function normalize(a, b, c)
{
	return (a - b) / (c - b);
}

function draw_heightmap(canvas_name, mode)
{
	var x, y, ctx, x_multiplier, y_multiplier, sea_level, coast_x;
	
	canvas = document.getElementById(canvas_name);
	
	ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	x_multiplier = canvas.width / _world.grid_width;
	y_multiplier = canvas.height / _world.grid_height;
	
	sea_level = 0.25;
	coast_x = 0.075;
	
	for (x=0; x<_world.grid_width; x++)
	{
		for (y=0; y<_world.grid_width; y++)
		{
			switch (mode)
			{
				case 1: // simple heightmap
					ctx.fillStyle = "rgba(255, 255, 255, " + (_world.grid[x][y][2]) + ")";
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
				
				case 2: // categorized heightmap
					switch (_world.grid[x][y][3])
					{
						case 1: // water
							if (_world.grid[x][y][2] > sea_level - coast_x)
							{
								f = normalize(_world.grid[x][y][2], sea_level - coast_x, sea_level);
								ctx.fillStyle = "rgba(" + rgb_interpolate(64, 64, 0, 255, 255, 0, f) + ", 1)";
							}
							else
							{
								f = normalize(_world.grid[x][y][2], 0, sea_level - coast_x);
								ctx.fillStyle = "rgba(" + rgb_interpolate(0, 32, 64, 0, 128, 255, f) + ", 1)";
							}
						break;
						
						case 2: // land
							f = normalize(_world.grid[x][y][2], sea_level, 1);
							ctx.fillStyle = "rgba(" + rgb_interpolate(0, 64, 0, 0, 255, 0, f) + ", 1)";
						break;
					}
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
				
				case 3: // shadowed heightmap
					switch (_world.grid[x][y][3])
					{
						case 1: // water
							if (_world.grid[x][y][2] > sea_level - coast_x)
							{
								ctx.fillStyle = "rgba(220, 200, 60, 1)";
							}
							else
							{
								ctx.fillStyle = "rgba(0, 64, 192, 1)";
							}
						break;
						
						case 2: // land
							ctx.fillStyle = "rgba(0, 140, 0, 1)";
						break;
					}
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
					
					f = _world.grid[x][y][4] * 4;
					
					if (f < 0)
					{
						ctx.fillStyle = "rgba(0, 0, 0, " + clamp(f * -1, 0, 1) + ")";
					}
					else
					{
						ctx.fillStyle = "rgba(255, 255, 255, " + clamp(f, 0, 1) + ")";
					}
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
			}
		}
	}
}

function draw_all()
{
	_world = new World();
	
	_world.generate_step1(_seed);
	draw_heightmap("canvas1", 1);
	
	_world.generate_step2(_seed);
	draw_heightmap("canvas2", 1);
	
	_world.generate_step3_quick(_sea_level, _coast_x);
	draw_heightmap("canvas3", 2);
	
	_world.generate_step4();
	draw_heightmap("canvas4", 3);
}

function init()
{
	draw_all();
}

window.onload = init;
