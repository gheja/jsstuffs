var _world = null;
var _layer_settings = [];
var _active_layer_id = 0;

/** @const */ var MAX_SEED = 62 * 62;
/** @const */ var CHARS_SEED = 2;
/** @const */ var MAX_RANGE = 62;
/** @const */ var CHARS_RANGE = 1;

/*
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
*/

function encode62(a, digits)
{
	var i, characters, result;
	
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	result = "";
	
	for (i=0; i<digits; i++)
	{
		result += characters[a % 62];
		a = Math.floor(a / 62);
	}
	
	return result;
}

function draw_heightmap(canvas_name, is_selected, is_valid)
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
			switch (_world.map[x][y])
			{
				case 0: // water
					ctx.fillStyle = "#025";
				break;
				
				case 1: // land
					ctx.fillStyle = "#341";
				break;
				
				case 2: // forest
					ctx.fillStyle = "#180";
				break;
				
				case 3: // hill
					ctx.fillStyle = "#666";
				break;
				
				case 4: // starting point
					ctx.fillStyle = "#fff";
				break;
			}
			
			ctx.fillRect(x * x_multiplier, y * y_multiplier, x_multiplier, y_multiplier);
		}
	}
	
	if (!is_valid)
	{
		ctx.fillStyle = "rgba(60, 20, 20, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		if (is_selected)
		{
			ctx.strokeStyle = "#f00";
		}
		else
		{
			ctx.strokeStyle = "#400";
		}
	}
	else
	{
		
		if (is_selected)
		{
			ctx.strokeStyle = "#08d";
		}
		else
		{
			ctx.strokeStyle = "#024";
		}
	}
	
	ctx.lineWidth = 1;
	ctx.moveTo(0.5, 0.5);
	ctx.lineTo(canvas.width - 0.5, 0.5);
	ctx.lineTo(canvas.width - 0.5, canvas.height - 0.5);
	ctx.lineTo(0.5, canvas.height - 0.5);
	ctx.lineTo(0.5, 0.5);
	ctx.stroke();
}

function layer_seeds_randomize(layer)
{
	var i;
	
	for (i=0; i<16; i++)
	{
		_layer_settings[layer].prev_seeds[i] = _layer_settings[layer].seeds[i];
		
		if (_layer_settings[layer].selected_seed != i)
		{
			_layer_settings[layer].seeds[i] = Math.floor(Math.random() * MAX_SEED);
		}
	}
}

function layer_seeds_randomize_undo(layer)
{
	var i;
	
	if (_layer_settings[layer].prev_seeds.length == 0)
	{
		return;
	}
	
	for (i=0; i<16; i++)
	{
		_layer_settings[layer].seeds[i] = _layer_settings[layer].prev_seeds[i];
	}
	
	_layer_settings[layer].prev_seeds = [];
}

function layer_seeds_init()
{
	var i;
	
	for (i=0; i<16; i++)
	{
		_layer_settings[i] = {
			seeds: [],
			prev_seeds: [],
			selected_seed: -1,
			range_a: 0,
			range_b: 64,
			old_value: 0,
			new_value: 1
		};
		
		layer_seeds_randomize(i);
		
		// default values
		_layer_settings[i].prev_seeds = [];
		_layer_settings[i].selected_seed = 0;
	}
	
	_layer_settings[0].old_value = 0;
	_layer_settings[0].new_value = 1;
	_layer_settings[1].old_value = 1;
	_layer_settings[1].new_value = 0;
	_layer_settings[2].old_value = 1;
	_layer_settings[2].new_value = 0;
	_layer_settings[3].old_value = 1;
	_layer_settings[3].new_value = 2;
	_layer_settings[4].old_value = 1;
	_layer_settings[4].new_value = 2;
	_layer_settings[5].old_value = 2;
	_layer_settings[5].new_value = 1;
	
	// player starting point selection has no ranges and values
	_layer_settings[6].range_a = -1;
	_layer_settings[6].range_b = -1;
	_layer_settings[6].old_value = -1;
	_layer_settings[6].new_value = -1;
}

function update()
{
	var i;
	
	_active_layer_id = document.getElementById("layer_selector").value;
	
	for (i=0; i<7; i++)
	{
		b = document.getElementById("layer_ranges_" + i);
		
		if (!b)
		{
			continue;
		}
		
		if (i == _active_layer_id)
		{
			b.style.display = "block";
		}
		else
		{
			b.style.display = "none";
		}
		
		if (_layer_settings[i].range_a != -1)
		{
			_layer_settings[i].range_a = parseInt(document.getElementById("range" + i + "a").value);
			_layer_settings[i].range_b = parseInt(document.getElementById("range" + i + "b").value);
		}
	}
}

function run()
{
	var i, l, save, s, t, u, valid;
	
	_world = new MapGenerator();
	
	_world.init(128);
	
	for (i=0; i<16; i++)
	{
		l = _layer_settings[i];
		
		if (_active_layer_id == i)
		{
			break;
		}
		
		if (l.range_a == 0 && l.range_b == 0)
		{
			continue;
		}
		
		_world.generateAndApplyLayer(l.seeds[l.selected_seed], l.range_a, l.range_b, l.old_value, l.new_value);
	}
	
	save = _world.miscGetMap();
	
	for (i=0; i<16; i++)
	{
		_world.miscSetMap(save);
		
		if (_active_layer_id == 6)
		{
			_world.findStartingPoints(l.seeds[i]);
			valid = _world.isMapValid();
		}
		else
		{
			if (l.range_a != 0 || l.range_b != 0)
			{
				_world.generateAndApplyLayer(l.seeds[i], l.range_a, l.range_b, l.old_value, l.new_value);
			}
			valid = true;
		}
		
		draw_heightmap("canvas_" + i, l.selected_seed == i, valid);
		
		if (i == l.selected_seed)
		{
			draw_heightmap("canvas_big", l.selected_seed == i, valid);
		}
	}
	
/*
	s = "";
	t = "";
	u = "";
	
	for (i=0; i<7; i++)
	{
		l = _layer_settings[i];
		
		if (l.range_a == 0 && l.range_b == 0)
		{
			s += "0";
			t += encode62(0, CHARS_SEED);
			t += encode62(0, CHARS_RANGE);
			t += encode62(0, CHARS_RANGE);
			u += encode62(0, CHARS_SEED);
		}
		else
		{
			s += l.seeds[l.selected_seed];
			t += encode62(l.seeds[l.selected_seed], CHARS_SEED);
			u += encode62(l.seeds[l.selected_seed], CHARS_SEED);
			
			if (l.range_a != -1)
			{
				s += "-" + (l.range_a) + "-" + l.range_b;
				t += encode62(l.range_a, CHARS_RANGE);
				t += encode62(l.range_b, CHARS_RANGE);
				u += encode62(l.range_a, CHARS_RANGE);
				u += encode62(l.range_b, CHARS_RANGE);
			}
			else
			{
				t += encode62(0, CHARS_RANGE);
				t += encode62(0, CHARS_RANGE);
			}
		}
		
		
		s += "/";
	}
*/
	s = "";
	
	for (i=0; i<7; i++)
	{
		l = _layer_settings[i];
		
		if (l.range_a == 0 && l.range_b == 0)
		{
			s += encode62(0, CHARS_SEED);
			s += encode62(0, CHARS_RANGE);
			s += encode62(0, CHARS_RANGE);
		}
		else
		{
			s += encode62(l.seeds[l.selected_seed], CHARS_SEED);
			
			if (l.range_a != -1)
			{
				s += encode62(l.range_a, CHARS_RANGE);
				s += encode62(l.range_b, CHARS_RANGE);
			}
			else
			{
				s += encode62(0, CHARS_RANGE);
				s += encode62(0, CHARS_RANGE);
			}
		}
	}
	
	document.getElementById("level_id").innerHTML = s;
//	document.getElementById("level_id").innerHTML = "<br/>v1: " + s + "<br/>v2: " + t + "<br/>v3: " + u;
}

function changed()
{
	update();
	run();
}

function select_seed(a)
{
	var b;
	
	b = a.id.split('_');
	
	_layer_settings[_active_layer_id].selected_seed = b[1];
	
	changed();
}

function randomize()
{
	layer_seeds_randomize(_active_layer_id);
	
	changed();
}

function randomize_undo()
{
	layer_seeds_randomize_undo(_active_layer_id);
	
	changed();
}

function init()
{
	layer_seeds_init();
	update();
	run();
}

window.onload = init;
