var _world = null;
// var _seed = 5896;
var _seed = Math.floor(Math.random() * 65535);
var _sea_level = 0.15;
var _coast_x = 0.02;
var _land_height = 20;
var _gl1 = null;
var _a = 0;
var _camera = null;
var _objects = [];

function interpolate(a, b, f)
{
	return a + (b - a) * f;
}

function rgb_interpolate(r1, g1, b1, r2, g2, b2, f)
{
	return Math.floor(interpolate(r1, r2, f)) + "," + Math.floor(interpolate(g1, g2, f)) + "," + Math.floor(interpolate(b1, b2, f));
}

function rgb_interpolate_array(r1, g1, b1, r2, g2, b2, f)
{
	return [ interpolate(r1, r2, f), interpolate(g1, g2, f), interpolate(b1, b2, f), 1.0 ];
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
	
	x_multiplier = canvas.width / _world.map_size;
	y_multiplier = canvas.height / _world.map_size;
	
	for (x=0; x<_world.map_size; x++)
	{
		for (y=0; y<_world.map_size; y++)
		{
			switch (mode)
			{
				case 1: // simple heightmap
					ctx.fillStyle = "rgba(255, 255, 255, " + (_world.map[x][y][2]) + ")";
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
				
				case 2: // categorized heightmap
					switch (_world.map[x][y][3])
					{
						case 1: // water
							if (_world.map[x][y][2] > _sea_level - _coast_x)
							{
								f = normalize(_world.map[x][y][2], _sea_level - _coast_x, _sea_level);
								ctx.fillStyle = "rgba(" + rgb_interpolate(64, 64, 0, 255, 255, 0, f) + ", 1)";
							}
							else
							{
								f = normalize(_world.map[x][y][2], 0, _sea_level - _coast_x);
								ctx.fillStyle = "rgba(" + rgb_interpolate(0, 32, 64, 0, 128, 255, f) + ", 1)";
							}
						break;
						
						case 2: // land
							f = normalize(_world.map[x][y][2], _sea_level, 1);
							ctx.fillStyle = "rgba(" + rgb_interpolate(0, 64, 0, 0, 255, 0, f) + ", 1)";
						break;
					}
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
				
				case 3: // shadowed heightmap
					switch (_world.map[x][y][3])
					{
						case 1: // water
							if (_world.map[x][y][2] > _sea_level - _coast_x)
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
					
					f = _world.map[x][y][4] * 4;
					
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
				
				case 4: // path-finder reachability
					
					if (_world.map[x][y][5] == 1) // reachable
					{
						switch (_world.map[x][y][3])
						{
							case 1: // water
								ctx.fillStyle = "rgb(0, 64, 0)";
							break;
							
							case 2: // land
								ctx.fillStyle = "rgb(0, 128, 0)";
							break;
						}
					}
					else
					{
						switch (_world.map[x][y][3])
							{
							case 1: // water
								ctx.fillStyle = "rgb(0, 0, 0)";
							break;
							
							case 2: // land
								ctx.fillStyle = "rgb(64, 0, 0)";
							break;
						}
					}
					
					ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
				break;
			}
		}
	}
	
	ctx.fillStyle = "#ffffff";
	
	for (x=0; x<_world.starting_points.length; x++)
	{
		p = _world.starting_points[x]
		ctx.fillRect(p[0] * x_multiplier, p[1] * y_multiplier, x_multiplier, y_multiplier);
	}
}

function draw_all()
{
	var rng;
	
	_world = new World();
	
	rng = new AlmostRandom(_seed);
	
	while (1)
	{
		_world.genGenerateHeightmap(rng.randomUInt32());
		draw_heightmap("canvas1", 1);
		
		_world.genFixHeightmap(rng.randomUInt32());
		draw_heightmap("canvas2", 1);
		
		_world.genFloodFill(_sea_level);
		draw_heightmap("canvas3", 2);
		
		_world.genGenerateLightmap();
		draw_heightmap("canvas4", 3);
		
		if (!_world.genGeneratePathFinderData(rng.randomUInt32()))
		{
			continue;
		}
		_world.genGenerateStartingPoints(rng.randomUInt32());
		_world.genFinalize(rng.randomUInt32(), _land_height * _world.map_size / 128);
		draw_heightmap("canvas5", 4);
		
		break;
	}
}



function webgl_run()
{
	var x, y, p1, p2, p3, p4, b, c, d, f, id;
	
	b = [];
	c = [];
	
	for (x = 0; x<_world.map_size - 1; x++)
	{
		for (y=0; y<_world.map_size - 1; y++)
		{
			p1 = _world.map[x][y];
			p2 = _world.map[x+1][y];
			p3 = _world.map[x][y+1];
			p4 = _world.map[x+1][y+1];
			
			b.push(
				p1[0], p1[1], p1[2],
				p2[0], p2[1], p2[2],
				p3[0], p3[1], p3[2],
				p3[0], p3[1], p3[2],
				p2[0], p2[1], p2[2],
				p4[0], p4[1], p4[2]
			);
			
			f = clamp(_world.map[x][y][4] * 5, -1, 1) * 0.5 + 0.5;
			
			switch (_world.map[x][y][3])
			{
				case 1: // water/coast
					if (_world.map[x][y][2] / _land_height > _sea_level - _coast_x)
					{
						// coast
						d = rgb_interpolate_array(0/255, 40/255, 0/255, 40/255, 190/255, 0/255, f);
						d = rgb_interpolate_array(d[0], d[1], d[2], 215/255, 215/255, 100/255, clamp(normalize(_world.map[x][y][2] / _land_height, _sea_level, _sea_level - _coast_x) * 2, 0, 1));
					}
					else
					{
						// water
						d = rgb_interpolate_array(10/255, 60/255, 180/255, 192/255, 192/255, 160/255, f * clamp(normalize(_world.map[x][y][2] / _land_height, (_sea_level - _coast_x) * 0.66, _sea_level - _coast_x) * 0.7, 0, 1));
					}
				break;
				
				case 2: // land
						d = rgb_interpolate_array(10/255/4, 40/255, 0/255, 40/255, 190/255, 0/255, f);
				break;
			}
/*
			// reachability
			switch (_world.map[x][y][5])
			{
				case 0: // water/coast
						d = rgb_interpolate(16/255, 16/255, 16/255, 192/255, 192/255, 192/255, f);
				break;
				
				case 1: // land
						d = rgb_interpolate(0/255, 64/255, 0/255, 0/255, 255/255, 0/255, f);
				break;
			}
*/
			c.push(
				d[0], d[1], d[2], d[3],
				d[0], d[1], d[2], d[3],
				d[0], d[1], d[2], d[3],
				
				d[0], d[1], d[2], d[3],
				d[0], d[1], d[2], d[3],
				d[0], d[1], d[2], d[3]
			);
		}
	}
	id = _gl1.createBody(b, c);
	
	_objects.push({ position: { x: 0, y: 0, z: 0, rot_x: 0, rot_y: 0, rot_z: 0 }, visible: true, bodies: [ { display_body_id: id, bone_length: 0, rotation: { rot_a: 0, rot_b: 0, rot_c: 0 } } ] });
	
	_gl1.setRenderableObjects(_objects);
}

function webgl_render()
{
	_a += 0.5;
	
	_camera.position.x = Math.sin(_a / 100) * _world.map_size * 0.75 + _world.map_size / 2;
	_camera.position.y = Math.cos(_a / 100) * _world.map_size * 0.75 + _world.map_size / 2;
	_camera.position.z = _land_height * 1.5;
	
	_gl1.drawScene();
}

function webgl_init()
{
	_gl1 = new DisplayWebgl({
		canvas_name: "canvas6",
		clear_color: [ 10/255, 60/255, 180/255 ]
	});
	
	_camera = _gl1.getCamera();
	_camera.target.x = _world.map_size / 2;
	_camera.target.y = _world.map_size / 2;
	_camera.target.z = -_world.map_size / 16;
	
	window.setInterval(webgl_render, 1000 / 60);
}



function init()
{
	draw_all();
	webgl_init();
	webgl_run();
}

window.onload = init;
