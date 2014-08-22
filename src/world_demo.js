var _seed = 42;

function draw_step1(canvas_name)
{
	var x, y, ctx, world, x_multiplier, y_multiplier, sea_level, world;
	
	world = new World();
	world.generate(_seed);
	
	canvas = document.getElementById(canvas_name);
	
	ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	x_multiplier = canvas.width / world.grid_width;
	y_multiplier = canvas.height / world.grid_height;
	
	sea_level = 0.5;
	
	for (x=0; x<world.grid_width; x++)
	{
		for (y=0; y<world.grid_width; y++)
		{
			ctx.fillStyle = "rgba(255, 255, 255, " + (world.grid[x][y]) + ")";
			
			ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
		}
	}
}

function init()
{
	draw_step1("canvas1");
}

window.onload = init;
