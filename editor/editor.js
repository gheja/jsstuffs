var _tabs = [];
var _current_tab_index = -1;
var _current_block_index = -1;
var _current_block_parameter_index = -1;
var _current_pe_name = '';
var _p_current_pe = null;
var _mouse_position = [ 0, 0 ];
var _show_friendly_values = 1;
var _shift_pressed = 0;
var _render_start_time = null;
var _last_render_message = "";

var _canvas = null;
var _canvas_y_position = 0;

var _synth_keyboard = null;

function redraw_tabs()
{
	var obj, html, i;
	
	html = "";
	html += "<div class=\"tab menu\" onclick=\"popup_menu(); return false;\">&#9776;</div>\n";
	for (i=0; i<_tabs.length; i++)
	{
		html += "<div class=\"tab " + _tabs[i].class + " " + (_current_tab_index == i ? "active" : "") + "\" onclick=\"select_tab(" + i + ", true); return false;\" ondblclick=\"tab_rename(" + i + "); return false;\">\n";
		html += "\t" + _tabs[i].pe.getTitle() + "\n";
		html += "</div>\n";
	}
	html += "<div class=\"tab new_tab\" onclick=\"popup_new_tab(); return false;\">+</div>\n";
	
	document.getElementById("tabs").innerHTML = html;
}

function tab_create_sample()
{
	var pe, seed_bullshits;
	
	seed_bullshits = [ "jiffies", "ducklings", "hammers", "impalas", "hamsters" ];
	
	pe_settings = new PackedEditor(
	[
		{
			title: "Settings",
			block_identifier: 0,
			parameters:
			[
				{
					title: "Zoom",
					unit: "%",
					value: 255,
					min: 1,
					max: 255,
					display_multiplier: 100 / 255
				},
			]
		},
	]);
	pe_settings.addBlock(0, 0);
	
	pe = new PackedEditor(
	[
		{
			title: "Create four point",
			block_identifier: 3,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					value: 120,
					min: 0,
					max: 65535
				},
				{
					title: "Point 1 value",
					unit: "%",
					value: 128,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 2 offset",
					unit: "samples",
					value: 20,
					min: 0,
					max: 255
				},
				{
					title: "... value",
					unit: "%",
					value: 255,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 3 offset",
					unit: "samples",
					value: 20,
					min: 0,
					max: 255
				},
				{
					title: "... value",
					unit: "%",
					value: 128,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 4 offset",
					unit: "samples",
					value: 20,
					min: 0,
					max: 255
				},
				{
					title: "... value",
					unit: "%",
					value: 0,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Trailing offset",
					unit: "samples",
					value: 20,
					min: 0,
					max: 255
				}
			]
		},
		{
			title: "Create sine",
			block_identifier: 4,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					value: 1000,
					min: 0,
					max: 65535
				}
			]
		},
		{
			title: "Create noise",
			block_identifier: 5,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					value: 1000,
					min: 0,
					max: 65535
				},
				{
					title: "Volume",
					unit: "%",
					value: 63,
					min: 0,
					max: 255,
					display_multiplier: 100 / 63
				},
				{
					title: "Seed",
					unit: seed_bullshits[Math.floor(Math.random() * seed_bullshits.length)],
					value: 100,
					min: 0,
					max: 65535
				}
			]
		},
		{
			title: "Volume",
			block_identifier: 51,
			parameters:
			[
				{
					title: "Volume",
					unit: "%",
					value: 63,
					min: 0,
					max: 255,
					display_multiplier: 100 / 63
				}
			]
		},
		{
			title: "Repeat",
			block_identifier: 53,
			parameters:
			[
				{
					title: "Count",
					unit: "times",
					value: 10,
					min: 1,
					max: 255
				}
			]
		},
		{
			title: "Finish",
			block_identifier: 101,
			parameters:
			[
				{
					title: "Operation",
					unit: "",
					value: 0,
					min: 0,
					max: 4,
					description: "0: overwrite<br/>1: add<br/>2: subtract<br/>3: multiply<br/>4: divide"
				}
			],
		}
	]);
	
	pe.setTitle("#" + (_tabs.length + 1) + ": sample");
	
	_tabs.push({
		pe_settings: pe_settings,
		pe: pe,
		class: "sample",
		show_block_indexes: 0
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
	
	set_status("Created new sample.");
}

function tab_create_instrument()
{
	var pe, pe_settings;
	
	pe_settings = new PackedEditor(
	[
		{
			title: "Settings",
			block_identifier: 0,
			parameters:
			[
				{
					title: "Sample number",
					unit: "",
					value: 0,
					min: 0,
					max: 255
				}
			]
		},
	]);
	pe_settings.addBlock(0, 0);
	
	pe = new PackedEditor(
	[
		{
			title: "Dummy",
			block_identifier: 0x00,
			parameters: [],
		},
	]);
	
	pe.setTitle("#" + (_tabs.length + 1));
	
	_tabs.push({
		pe_settings: pe_settings,
		pe: pe,
		class: "instrument",
		show_block_indexes: 0
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
	
	set_status("Created new instrument.");
};

function tab_create_skeleton()
{
	var pe = new PackedEditor(
	[
		{
			title: "Bone",
			block_identifier: 0x01,
			parameters: [
				{
					title: "Parent bone",
					unit: "",
					value: 0,
					min: 0,
					max: 63
				},
				{
					title: "Length",
					unit: "",
					value: 10,
					min: 0,
					max: 255
				},
				{
					title: "Rotation",
					unit: "degrees",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle X",
					unit: "degrees",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle Y",
					unit: "degrees",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle Z",
					unit: "degrees",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				}
			],
		},
	]);
	
	pe.setTitle("#" + (_tabs.length + 1));
	
	_tabs.push({
		pe: pe,
		class: "skeleton",
		show_block_indexes: 1
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
	
	set_status("Created new skeleton.");
};

function tab_create_skeletal_animation()
{
	var pe = new PackedEditor(
	[
		{
			title: "Dummy",
			block_identifier: 0x00,
			parameters: [],
		},
	]);
	
	pe.setTitle("#" + (_tabs.length + 1));
	
	_tabs.push({
		pe: pe,
		class: "skeletal_animation",
		show_block_indexes: 0
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
	
	set_status("Created new skeletal animation.");
};

function tab_create_model()
{
	var pe = new PackedEditor(
	[
		{
			title: "Dummy",
			block_identifier: 0x00,
			parameters: [],
		},
	]);
	
	pe.setTitle("#" + (_tabs.length + 1));
	
	_tabs.push({
		pe: pe,
		class: "model",
		show_block_indexes: 0
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
	
	set_status("Created new model.");
};

function tab_remove(j)
{
	var i, new_tabs, new_tab_index;
	
	new_tabs = [];
	
	for (i=0; i<_tabs.length; i++)
	{
		if (i == j)
		{
			continue;
		}
		new_tabs.push(_tabs[i]);
	}
	
	_tabs = new_tabs;
	
	if (_tabs.length == 0)
	{
		new_tab_index = -1;
	}
	else
	{
		if (_current_tab_index == j)
		{
			new_tab_index = j - 1;
		}
		
		if (new_tab_index < 0 && _tabs.length > 0)
		{
			new_tab_index = 0;
		}
	}
	
	select_tab(new_tab_index);
	
	update_all();
	
	set_status("Removed tab.");
}

function tab_remove_current()
{
	popup_list([
		{ js_code: "tab_remove(" + _current_tab_index + ");", title: "Remove \"" + _tabs[_current_tab_index].pe.title + "\""}
	]);
}

function tab_rename(i)
{
	var old_title, new_title;
	
	old_title = _tabs[i].pe.getTitle();
	new_title = prompt('New title', old_title);
	
	if (new_title && new_title != old_title)
	{
		update_tab_title(i, new_title);
		
		set_status("Renamed tab from \"" + old_title + "\" to \"" + new_title + "\".");
	}
	else
	{
		set_status("Tab was not renamed.");
	}
}

function tab_rename_current()
{
	tab_rename(_current_tab_index);
}

function _get_block_html(block, block_id, pe_name, show_reorganizer_buttons)
{
	var html, parameter, tmp, value, j, i;
	
	i = block_id;
	
	// yeah, this is ugly, but... you expect me to write all those document.createElement()s? you can't be that cruel.
	
	html = "";
	html += "<li class=\"block " + (block.collapsed ? "collapsed" : "") + "\" onmouseover=\"set_active_pe('" + pe_name + "');\" onmouseout=\"set_active_pe('');\">\n";
	html += "\t<div class=\"title\">\n";
	html += "\t\t" + block.title + (_tabs[_current_tab_index].show_block_indexes ? " (" + i + ")" : "") + "\n";
	html += "\t\t<div class=\"buttons\">\n";
	html += "\t\t\t<div onclick=\"block_expand(" + i + "); return false;\" class=\"button expand\" title=\"Expand\">&#9606;</div>\n";
	html += "\t\t\t<div onclick=\"block_collapse(" + i + "); return false;\" class=\"button collapse\" title=\"Collapse\">&#9602;</div>\n";
	if (show_reorganizer_buttons)
	{
		html += "\t\t\t<div onclick=\"block_remove(" + i + "); return false;\" class=\"button\" title=\"Remove this block\">x</div>\n";
		html += "\t\t\t<div onclick=\"popup_block_add(" + i + "); return false;\" class=\"button\" title=\"Add item above this\">+&#9650;</div>\n";
		html += "\t\t\t<div onclick=\"popup_block_add(" + (i + 1) + "); return false;\" class=\"button\" title=\"Add item below this\">+&#9660;</div>\n";
		html += "\t\t\t<div onclick=\"return false;\" class=\"button\" title=\"Move item\">&#9650;&#9660;</div>\n";
	}
	html += "\t\t</div>\n";
	html += "\t</div>\n";
	html += "\t<div class=\"details\">\n";
	for (j=0; j<block.parameters.length; j++)
	{
		parameter = block.parameters[j];
		html += "\t\t<div onmouseover=\"set_active_block_parameter(" + i + ", " + j + ");\" onmouseout=\"set_active_block_parameter(-1, -1);\">\n";
		html += "\t\t\t<label for=\"parameter_" + i + "_" + j + "_" + pe_name + "\">" + parameter.title + ":</label>\n";
		html += "\t\t\t<div class=\"gauge\"><div class=\"used\" style=\"width: " + Math.round(parameter.value / (parameter.max - parameter.min) * 100) + "\">&nbsp;</div></div>\n";
		if (_show_friendly_values)
		{
			value = parameter.value * (parameter.display_multiplier != undefined ? parameter.display_multiplier : 1) + (parameter.display_correction != undefined ? parameter.display_correction : 0);
			
			if (parameter.unit == "%" || parameter.unit == "percent" || parameter.unit == "degrees")
			{
				tmp = "";
				if (value < 0)
				{
					tmp = "-";
				}
				tmp += Math.floor(Math.abs(value));
				tmp += ".";
				tmp += Math.floor(Math.abs(value * 10)) % 10;
				
				value = tmp;
			}
			
			html += "\t\t\t<input readonly=\"readonly\" id=\"parameter_" + i + "_" + j + "_" + pe_name + "\" type=\"text\" value=\"" + value + "\" />\n";
			html += "\t\t\t<div class=\"unit\">" + parameter.unit + "</div>\n";
		}
		else
		{
			html += "\t\t\t<input readonly=\"readonly\" class=\"raw\" id=\"parameter_" + i + "_" + j + "_" + pe_name + "\" type=\"text\" value=\"" + parameter.value + "\" />\n";
			html += "\t\t\t<div class=\"unit\">&nbsp;</div>\n";
		}
		
		if (parameter.description)
		{
			// this is a clearer, too
			html += "\t\t\t<div class=\"description\">" + parameter.description + "</div>\n";
		}
		else
		{
			html += "\t\t\t<br class=\"clearer\" />\n";
		}
		html += "\t\t</div>\n";
	}
	html += "\t</div>\n";
	html += "</li>\n";
	
	return html;
}

function update_sidebar()
{
	var html, blocks, i;
	
	html = "";
	
	if (_current_tab_index != -1)
	{
		html += "<ul>\n";
		if (_tabs[_current_tab_index].pe_settings)
		{
			blocks = _tabs[_current_tab_index].pe_settings.getBlocks();
			
			for (i=0; i<blocks.length; i++)
			{
				html += _get_block_html(blocks[i], i, 'settings', false);
			}
		}
		
		if (_tabs[_current_tab_index].pe)
		{
			blocks = _tabs[_current_tab_index].pe.getBlocks();
			
			for (i=0; i<blocks.length; i++)
			{
				html += _get_block_html(blocks[i], i, '', true);
			}
			html += "<li><div class=\"button\" onclick=\"popup_block_add(9999); return false;\" title=\"Add item here\">+</div></li>\n";
		}
		html += "</ul>\n";
		
	}
	
	document.getElementById("sidebar").innerHTML = html;
}

function popup_block_add(position)
{
	var i, blocks, list;
	
	blocks = _p_current_pe.getBuildingBlocks();
	
	list = [];
	for (i=0; i<blocks.length; i++)
	{
		list.push({ js_code: "block_add(" + blocks[i].block_identifier + "," + position + ");", title: blocks[i].title });
	}
	popup_list(list);
}

function block_collapse(position)
{
	_p_current_pe.setBlockProperty(position, "collapsed", 1);
	update_tab();
}

function block_expand(position)
{
	_p_current_pe.setBlockProperty(position, "collapsed", 0);
	update_tab();
}

function block_add(block_identifer, position)
{
	_p_current_pe.addBlock(block_identifer, position);
	update_tab();
}

function block_remove(position)
{
	_p_current_pe.removeBlock(position);
	update_tab();
}

function update_tab_title(i, new_title)
{
	if (new_title == "")
	{
		return;
	}
	
	_tabs[i].pe.setTitle(new_title);
	update_all();
}

function canvas_show()
{
	_canvas.style.display = "block";
}

function canvas_hide()
{
	_canvas.style.display = "none";
}

function canvas_clear()
{
	var ctx;
	
	_canvas.width = _canvas.parentNode.clientWidth;
	_canvas.height = _canvas.parentNode.clientHeight;
	
	ctx = _canvas.getContext("2d");
	ctx.fillStyle = "#111";
	ctx.fillRect(0, 0, _canvas.width, _canvas.height);
	
	_canvas_y_position = 0;
}

function synth_keyboard_init()
{
	var keys, key, i, html, left, left_corr;
	
	html = "";
	
	keys = [
		[ "z", 0, 0 ],
		[ "s", 1, 1 ],
		[ "x", 0, 2 ],
		[ "d", 1, 3 ],
		[ "c", 0, 4 ],
		[ "v", 0, 5 ],
		[ "g", 1, 6 ],
		[ "b", 0, 7 ],
		[ "h", 1, 8 ],
		[ "n", 0, 9 ],
		[ "j", 1, 10 ],
		[ "m", 0, 11 ],
		
		[ "q", 0, 12 ],
		[ "2", 1, 13 ],
		[ "w", 0, 14 ],
		[ "3", 1, 15 ],
		[ "e", 0, 16 ],
		[ "r", 0, 17 ],
		[ "5", 1, 18 ],
		[ "t", 0, 19 ],
		[ "6", 1, 20 ],
		[ "y", 0, 21 ],
		[ "7", 1, 22 ],
		[ "u", 0, 23 ],
		
		[ "i", 0, 24 ],
		[ "9", 1, 25 ],
		[ "o", 0, 26 ],
		[ "0", 1, 27 ],
		[ "p", 0, 28 ],
		[ "[", 0, 29 ],
		[ "=", 1, 30 ],
		[ "]", 0, 31 ]
	];
	
	html += "<ul>";
	left = -40;
	left_corr = 0;
	for (i=0; i<keys.length; i++)
	{
		key = keys[i];
		if (key[1] != 1)
		{
			class_name = "white";
			left += 40;
			left_corr =0 ;
		}
		else
		{
			class_name = "black";
			left_corr += 27;
		}
		
		html += "<li id=\"synth_key_" + key[2] + "_" + i + "\" class=\"" + class_name + "\" style=\"left: " + (left + left_corr) + "px\">" + key[0] + "<br/>C4</li>\n";
	}
	html += "</ul>";
	
	_synth_keyboard.innerHTML = html;
}

function synth_keyboard_show()
{
	_synth_keyboard.style.width = _synth_keyboard.parentNode.clientWidth;
	// _synth_keyboard.height = _synth_keyboard.parentNode.clientHeight;
	_synth_keyboard.style.display = "block";
}

function synth_keyboard_hide()
{
	_synth_keyboard.style.display = "none";
}

function render_samples(wave, color, collapsed, scale)
{
	var ctx = _canvas.getContext("2d");
	var i, j, height;
	
	if (wave == null)
	{
		j = _canvas.width;
		
		// force collapse as this cannot be rendered...
		collapsed = 1;
	}
	else
	{
		j = Math.min(_canvas.width, wave.length / scale);
	}
	
	y = _canvas_y_position;
	
	if (collapsed)
	{
		height = 4;
		ctx.fillStyle = color;
		ctx.fillRect(0, y, j, height);
	}
	else
	{
		// this should be an even number
		height = 104;
		
		ctx.fillStyle = "rgba(0,0,0,0.66)";
		ctx.fillRect(0, y, j, height);
		
		ctx.beginPath();
		ctx.moveTo(0, y + height / 2 - wave[0]/32768 * 50);
		for (i=0; i<j; i++)
		{
			ctx.lineTo(i, y + height / 2 - wave[(i*scale) | 0] / 32768 * 50);
		}
		
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.stroke();
	}
	
	_canvas_y_position += height + 2;
}

function callback_synth_sample_generator_block(block_id, data)
{
	var blocks, scale;
	
	blocks = _tabs[_current_tab_index].pe_settings.getBlocks();
	scale = 1 / (blocks[0].parameters[0].value / 255);
	
	blocks = _tabs[_current_tab_index].pe.getBlocks();
	if (block_id < blocks.length)
	{
		if (blocks[block_id].block_identifier < 10)
		{
			render_samples(data, "#eb0", blocks[block_id].collapsed, scale);
		}
		else if (blocks[block_id].block_identifier < 100)
		{
			render_samples(data, "#a94", blocks[block_id].collapsed, scale);
		}
		else
		{
			render_samples(null, "#444", 1, scale);
		}
	}
	else
	{
		render_samples(data, "#fff", 0, scale);
	}
}

function update_main_window()
{
	var buffer, tab, obj, tmp;
	
	if (_current_tab_index == -1)
	{
		return;
	}
	
	tab = _tabs[_current_tab_index];
	if (tab.pe)
	{
		buffer = tab.pe.render();
		_last_render_message = tab.pe.getLastRenderMessage();
		
		if (tab.class == "sample")
		{
			canvas_clear();
			obj = new SynthSampleGenerator(null);
			obj.setAfterBlockCallback(callback_synth_sample_generator_block.bind());
			tmp = obj.render(buffer, 1);
			_last_render_message += " | Final output: " + tmp.length + " samples, " + (tmp.length * 2) + " bytes, " + Math.round(tmp.length / 44100 * 1000) + " ms (44.1 kHz, 16 bit, mono).";
		}
	}
}

function update_tab()
{
	var t1, t2;
	t1 = (new Date()).getTime();
	
	update_sidebar();
	update_main_window();
	
	t2 = (new Date()).getTime();
	
	set_status("Everything is up-to-date, rendered in " + (t2 - t1) + " ms. | " + _last_render_message);
}

function update_all()
{
	redraw_tabs();
	update_tab();
}

function select_tab(i, popup_menu_if_selected)
{
	if (_current_tab_index == i)
	{
		popup_list([
			{ js_code: "tab_rename_current();", title: "Set title for current tab", disabled: _current_tab_index == -1 },
			{ js_code: "tab_remove_current();", title: "Discard current tab", disabled: _current_tab_index == -1, dont_hide_popup: 1 }
		]);
		return;
	}
	
	_current_tab_index = i;
	
	canvas_hide();
	synth_keyboard_hide();
	
	if (_current_tab_index == -1)
	{
		return;
	}
	
	if (_tabs[_current_tab_index].class == "sample")
	{
		canvas_show();
	}
	else if (_tabs[_current_tab_index].class == "instrument")
	{
		synth_keyboard_show();
	}
	
	set_active_pe('');
	update_all();
}

function set_status(new_status)
{
	document.getElementById("statusbar").innerHTML = new_status;
}

function set_friendly_values(new_value)
{
	_show_friendly_values = new_value;
	update_tab();
}

function set_active_pe(pe_name)
{
	_current_pe_name = pe_name;
	
	if (pe_name == 'settings')
	{
		_p_current_pe = _tabs[_current_tab_index].pe_settings;
	}
	else
	{
		_p_current_pe = _tabs[_current_tab_index].pe;
	}
}

function set_active_block_parameter(block_id, parameter_id)
{
	_current_block_index = block_id;
	_current_block_parameter_index = parameter_id;
}

function alter_block_parameter_value(block_id, parameter_id, value)
{
	var new_value;
	
	new_value = _p_current_pe.getParameterValue(block_id, parameter_id) + value;
	_p_current_pe.setParameterValue(block_id, parameter_id, new_value);
	
	update_tab();
}

function alter_block_parameter_value_big(block_id, parameter_id, value)
{
	var blocks, diff;
	
	blocks = _p_current_pe.getBlocks();
	
	diff = blocks[block_id].parameters[parameter_id].max - blocks[block_id].parameters[parameter_id].min;
	
	// // fixed 5%, but 2 at least
	// alter_block_parameter_value(block_id, parameter_id, Math.max(Math.floor(diff * 0.05), 2) * value);
	
	if (diff > 255)
	{
		alter_block_parameter_value(block_id, parameter_id, value * 100);
	}
	else if (diff > 10)
	{
		alter_block_parameter_value(block_id, parameter_id, value * 5);
	}
	else
	{
		alter_block_parameter_value(block_id, parameter_id, value * 2);
	}
}

function popup_show(html)
{
	var popup, popup_background, x, y;
	
	popup = document.getElementById("popup");
	popup_background = document.getElementById("popup_background");
	
	popup.innerHTML = html;
	
	// new popups will appear below cursor, sub-popus beside it
	if (popup.style.display != "block")
	{
		x = _mouse_position[0] - 10;
		y = _mouse_position[1] + 10;
	}
	else
	{
		x = _mouse_position[0];
		y = _mouse_position[1] - 10;
	}
	
	if (x + 204 > window.innerWidth)
	{
		x = window.innerWidth - 204;
	}
	
	// just an approximation
	if (y + 200 > window.innerHeight)
	{
		y = window.innerHeight - 200;
	}
	
	if (x < 0)
	{
		x = 0;
	}
	
	if (y < 0)
	{
		y = 0;
	}
	
	popup.style.left = x;
	popup.style.top = y;
	popup_background.style.display = "block";
	popup.style.display = "block";
}

function popup_hide()
{
	document.getElementById("popup_background").style.display = "none";
	document.getElementById("popup").style.display = "none";
}

function popup_list(list)
{
	var i, html;
	
	html = "<ul>\n";
	
	for (i=0; i<list.length; i++)
	{
		if (list[i].disabled)
		{
			html += "\t<li onclick=\"event.stopPropagation(); return false;\" class=\"disabled\">" + list[i].title + "</li>\n";
		}
		else
		{
			html += "\t<li onclick=\"" + list[i].js_code + "; " + (list[i].dont_hide_popup ? "event.stopPropagation(); " : "") + "return false;\">" + list[i].title + "</li>\n";
		}
	}
	html += "\t<li onclick=\"popup_hide(); return false;\">Cancel</li>\n";
	html += "</ul>\n";
	
	popup_show(html);
}

function popup_yesno(message, yes_callback, no_callback)
{
	
}

function popup_new_tab()
{
	popup_list([
		{ js_code: "tab_create_sample();", title: "New sample" },
		{ js_code: "tab_create_instrument();", title: "New instrument" },
		{ js_code: "tab_create_skeleton();", title: "New skeleton" },
		{ js_code: "tab_create_skeletal_animation();", title: "New skeletal animation" },
		{ js_code: "tab_create_model();", title: "New model" }
	]);
}


function popup_menu()
{
	popup_list([
		{ js_code: "", title: "Undo" },
		{ js_code: "", title: "Redo" },
		{ js_code: "popup_new_tab();", title: "Add new tab ...", dont_hide_popup: 1 },
		{ js_code: "popup_block_add(9999);", title: "Add new block ...", disabled: _current_tab_index == -1, dont_hide_popup: 1 },
		(_show_friendly_values ?
			{ js_code: "set_friendly_values(0);", title: "Show raw values" } :
			{ js_code: "set_friendly_values(1);", title: "Show friendly values" }
		),
		{ js_code: "tab_rename_current();", title: "Set title for current tab", disabled: _current_tab_index == -1 },
		{ js_code: "tab_remove_current();", title: "Discard current tab", disabled: _current_tab_index == -1, dont_hide_popup: 1 },
		{ js_code: "", title: "Save session" },
		{ js_code: "", title: "Load session" }
	]);
}

function handle_mouse_move(event)
{
	// will have no window scrolling on the page
	_mouse_position[0] = event.pageX;
	_mouse_position[1] = event.pageY;
}

function handle_mouse_wheel(event)
{
	if (event.wheelDelta < 0)
	{
		if (_shift_pressed)
		{
			alter_block_parameter_value_big(_current_block_index, _current_block_parameter_index, -1);
		}
		else
		{
			alter_block_parameter_value(_current_block_index, _current_block_parameter_index, -1);
		}
	}
	else if (event.wheelDelta > 0)
	{
		if (_shift_pressed)
		{
			alter_block_parameter_value_big(_current_block_index, _current_block_parameter_index, +1);
		}
		else
		{
			alter_block_parameter_value(_current_block_index, _current_block_parameter_index, +1);
		}
	}
}

function handle_key_down(event)
{
	if (event.keyCode === 16 || event.charCode === 16)
	{
		_shift_pressed = 1;
	}
}
function handle_key_up(event)
{
	if (event.keyCode === 16 || event.charCode === 16)
	{
		_shift_pressed = 0;
	}
}

function init()
{
	window.onmousemove = handle_mouse_move;
	window.onmousewheel = handle_mouse_wheel;
	window.onkeydown = handle_key_down;
	window.onkeyup = handle_key_up;
	
	_canvas = document.getElementById("main_canvas");
	_synth_keyboard = document.getElementById("main_synth_keyboard");
	
	synth_keyboard_init();
	
	update_all();
	set_status("Initialization successful, welcome!");
}
