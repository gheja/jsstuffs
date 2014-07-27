var _tabs = [];
var _current_tab_index = -1;
var _current_block_index = -1;
var _current_block_parameter_index = -1;
var _mouse_position = [ 0, 0 ];
var _show_friendly_values = 1;
var _shift_pressed = 0;

function redraw_tabs()
{
	var obj, html, i;
	
	html = "";
	html += "<div class=\"tab menu\" onclick=\"popup_menu(); return false;\">&#9776;</div>\n";
	for (i=0; i<_tabs.length; i++)
	{
		html += "<div class=\"tab " + _tabs[i].class + " " + (_current_tab_index == i ? "active" : "") + "\" onclick=\"select_tab(" + i + "); return false;\" ondblclick=\"tab_rename(" + i + "); return false;\">\n";
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
	
	pe = new PackedEditor(
	[
		{
			title: "Create four point",
			block_identifier: 0x03,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					type: "uint16",
					value: 120,
					min: 0,
					max: 65535,
					display_multiplier: 1
				},
				{
					title: "Point 1 value",
					unit: "%",
					type: "uint8",
					value: 128,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 2 offset",
					unit: "samples",
					type: "uint8",
					value: 20,
					min: 0,
					max: 255,
					display_multiplier: 1
				},
				{
					title: "... value",
					unit: "%",
					type: "uint8",
					value: 255,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 3 offset",
					unit: "samples",
					type: "uint8",
					value: 20,
					min: 0,
					max: 255,
					display_multiplier: 1
				},
				{
					title: "... value",
					unit: "%",
					type: "uint8",
					value: 128,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Point 4 offset",
					unit: "samples",
					type: "uint8",
					value: 20,
					min: 0,
					max: 255,
					display_multiplier: 1
				},
				{
					title: "... value",
					unit: "%",
					type: "uint8",
					value: 0,
					min: 0,
					max: 255,
					display_multiplier: 200 / 255,
					display_correction: -100
				},
				{
					title: "Trailing offset",
					unit: "samples",
					type: "uint8",
					value: 20,
					min: 0,
					max: 255,
					display_multiplier: 1
				}
			]
		},
		{
			title: "Create sine",
			block_identifier: 0x04,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					type: "uint16",
					value: 1000,
					min: 0,
					max: 65535,
					display_multiplier: 1
				}
			]
		},
		{
			title: "Create noise",
			block_identifier: 0x05,
			parameters:
			[
				{
					title: "Length",
					unit: "samples",
					type: "uint16",
					value: 1000,
					min: 0,
					max: 65535,
					display_multiplier: 1
				},
				{
					title: "Volume",
					unit: "samples",
					type: "uint8",
					value: 100,
					min: 0,
					max: 100,
					display_multiplier: 1
				},
				{
					title: "Seed",
					unit: seed_bullshits[Math.floor(Math.random() * seed_bullshits.length)],
					type: "uint8",
					value: 100,
					min: 0,
					max: 65535,
					display_multiplier: 1
				}
			]
		},
		{
			title: "Volume",
			block_identifier: 0x51,
			parameters:
			[
				{
					title: "Volume",
					unit: "%",
					type: "uint8",
					value: 63,
					min: 0,
					max: 255,
					display_multiplier: 100 / 63
				}
			]
		},
		{
			title: "Repeat",
			block_identifier: 0x53,
			parameters:
			[
				{
					title: "Count",
					unit: "times",
					type: "uint8",
					value: 10,
					min: 1,
					max: 255,
					display_multiplier: 1
				}
			]
		},
		{
			title: "Finish",
			block_identifier: 0x101,
			parameters:
			[
				{
					title: "Operation",
					unit: "",
					type: "uint8",
					value: 0,
					min: 0,
					max: 4,
					display_multiplier: 1,
					description: "0: overwrite<br/>1: add<br/>2: subtract<br/>3: multiply<br/>4: divide"
				}
			],
		}
	]);
	
	pe.setTitle("#" + (_tabs.length + 1) + ": sample");
	
	_tabs.push({
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
					type: "uint8",
					value: 0,
					min: 0,
					max: 63,
					display_multiplier: 1
				},
				{
					title: "Length",
					unit: "",
					type: "uint8",
					value: 10,
					min: 0,
					max: 255,
					display_multiplier: 1
				},
				{
					title: "Rotation",
					unit: "degrees",
					type: "uint8",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle X",
					unit: "degrees",
					type: "uint8",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle Y",
					unit: "degrees",
					type: "uint8",
					value: 127,
					min: 0,
					max: 254,
					display_multiplier: 720 / 254,
					display_correction: -360
				},
				{
					title: "Angle Z",
					unit: "degrees",
					type: "uint8",
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
	var i, new_tabs;
	
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
	
	if (_current_tab_index == j)
	{
		_current_tab_index--;
	}
	if (_current_tab_index < 0 && _tabs.length > 0)
	{
		_current_tab_index = 0;
	}
	
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

function update_sidebar()
{
	var html, blocks, block, parameter, i, j, value, tmp;
	
	html = "";
	
	
	if (_current_tab_index != -1)
	{
		if (_tabs[_current_tab_index].pe)
		{
			blocks = _tabs[_current_tab_index].pe.getBlocks();
			
			// yeah, this is ugly, but... you expect me to write all those document.createElement()s? you can't be that cruel.
			
			html += "<ul>";
			for (i=0; i<blocks.length; i++)
			{
				block = blocks[i];
				html += "<li class=\"block " + (block.collapsed ? "collapsed" : "") + "\">\n";
				html += "\t<div class=\"title\">\n";
				html += "\t\t" + block.title + (_tabs[_current_tab_index].show_block_indexes ? " (" + i + ")" : "") + "\n";
				html += "\t\t<div class=\"buttons\">\n";
				html += "\t\t\t<a href=\"#\" onclick=\"block_expand(" + i + "); return false;\" class=\"button expand\" title=\"Expand\">&#9606;</a>\n";
				html += "\t\t\t<a href=\"#\" onclick=\"block_collapse(" + i + "); return false;\" class=\"button collapse\" title=\"Collapse\">&#9602;</a>\n";
				html += "\t\t\t<a href=\"#\" onclick=\"block_remove(" + i + "); return false;\" class=\"button\" title=\"Remove this block\">x</a>\n";
				html += "\t\t\t<a href=\"#\" onclick=\"popup_block_add(" + i + "); return false;\" class=\"button\" title=\"Add item above this\">+&#9650;</a>\n";
				html += "\t\t\t<a href=\"#\" onclick=\"popup_block_add(" + (i + 1) + "); return false;\" class=\"button\" title=\"Add item below this\">+&#9660;</a>\n";
				html += "\t\t\t<a href=\"#\" onclick=\"return false;\" class=\"button\" title=\"Move item\">&#9650;&#9660;</a>\n";
				html += "\t\t</div>\n";
				html += "\t</div>\n";
				html += "\t<div class=\"details\">\n";
				for (j=0; j<block.parameters.length; j++)
				{
					parameter = block.parameters[j];
					html += "\t\t<div onmouseover=\"set_active_block_parameter(" + i + ", " + j + ");\" onmouseout=\"set_active_block_parameter(-1, -1);\">\n";
					html += "\t\t\t<label for=\"parameter_" + i + "_" + j + "\">" + parameter.title + ":</label>\n";
					html += "\t\t\t<div class=\"gauge\"><div class=\"used\" style=\"width: " + Math.round(parameter.value / (parameter.max - parameter.min) * 100) + "\">&nbsp;</div></div>\n";
					if (_show_friendly_values)
					{
						value = parameter.value * parameter.display_multiplier + (parameter.display_correction ? parameter.display_correction : 0);
						
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
						
						html += "\t\t\t<input readonly=\"readonly\" id=\"parameter_" + i + "_" + j + "\" type=\"text\" value=\"" + value + "\" />\n";
						html += "\t\t\t<div class=\"unit\">" + parameter.unit + "</div>\n";
					}
					else
					{
						html += "\t\t\t<input readonly=\"readonly\" class=\"raw\" id=\"parameter_" + i + "_" + j + "\" type=\"text\" value=\"" + parameter.value + "\" />\n";
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
			}
			html += "</ul>";
			
			html += "<a href=\"#\" class=\"button\" onclick=\"popup_block_add(9999); return false;\" title=\"Add item here\">+</a>\n";
		}
	}
	
	document.getElementById("sidebar").innerHTML = html;
}

function popup_block_add(position)
{
	var i, pe, blocks, list;
	
	pe = _tabs[_current_tab_index].pe;
	blocks = pe.getBuildingBlocks();
	
	list = [];
	for (i=0; i<blocks.length; i++)
	{
		list.push({ js_code: "block_add(" + blocks[i].block_identifier + "," + position + ");", title: blocks[i].title });
	}
	popup_list(list);
}

function block_collapse(position)
{
	_tabs[_current_tab_index].pe.setBlockProperty(position, "collapsed", 1);
	update_sidebar();
}

function block_expand(position)
{
	_tabs[_current_tab_index].pe.setBlockProperty(position, "collapsed", 0);
	update_sidebar();
}

function block_add(block_identifer, position)
{
	_tabs[_current_tab_index].pe.addBlock(block_identifer, position);
	update_sidebar();
}

function block_remove(position)
{
	_tabs[_current_tab_index].pe.removeBlock(position);
	update_sidebar();
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

function update_all()
{
	redraw_tabs();
	update_sidebar();
}

function select_tab(i)
{
	_current_tab_index = i;
	update_all();
}

function set_status(new_status)
{
	document.getElementById("statusbar").innerHTML = new_status;
}

function set_friendly_values(new_value)
{
	_show_friendly_values = new_value;
	update_sidebar();
}

function set_active_block_parameter(block_id, parameter_id)
{
	_current_block_index = block_id;
	_current_block_parameter_index = parameter_id;
}

function alter_block_parameter_value(block_id, parameter_id, value)
{
	var new_value;
	
	new_value =  _tabs[_current_tab_index].pe.getParameterValue(block_id, parameter_id) + value;
	_tabs[_current_tab_index].pe.setParameterValue(block_id, parameter_id, new_value);
	
	update_sidebar();
}

function alter_block_parameter_value_big(block_id, parameter_id, value)
{
	var blocks, diff;
	
	blocks = _tabs[_current_tab_index].pe.getBlocks();
	
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
			html += "\t<li><a href=\"#\" onclick=\"event.stopPropagation(); return false;\" class=\"disabled\">" + list[i].title + "</a></li>\n";
		}
		else
		{
			html += "\t<li><a href=\"#\" onclick=\"" + list[i].js_code + "; " + (list[i].dont_hide_popup ? "event.stopPropagation(); " : "") + "return false;\">" + list[i].title + "</a></li>\n";
		}
	}
	html += "\t<li><a href=\"#\" onclick=\"popup_hide(); return false;\">Cancel</a></li>\n";
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
	update_all();
	set_status("Initialization successful, welcome!");
}
