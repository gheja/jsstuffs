var _tabs = [];
var _current_tab = -1;
var _mouse_position = [ 0, 0 ];

function redraw_tabs()
{
	var obj, html, i;
	
	html = "";
	for (i=0; i<_tabs.length; i++)
	{
		html += "<div class=\"tab " + _tabs[i].class + " " + (_current_tab == i ? "active" : "") + "\" onclick=\"select_tab(" + i + "); return false;\" ondblclick=\"update_tab_title(" + i + ", prompt('New title', '" + _tabs[i].pe.getTitle() + "'));\">\n";
		html += "\t" + _tabs[i].pe.getTitle() + "\n";
		html += "</div>\n";
	}
	html += "<div class=\"tab new_tab\" onclick=\"popup_new_tab(); return false;\">+</div>\n";
	
	document.getElementById("tabs").innerHTML = html;
}

function tab_create_sample()
{
	var pe = new PackedEditor(
	[
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
		}
	]);
	
	pe.setTitle("#" + (_tabs.length + 1) + ": sample");
	
	_tabs.push({
		pe: pe,
		class: "sample"
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
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
		class: "instrument"
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
};

function tab_create_skeleton()
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
		class: "skeleton"
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
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
		class: "skeletal_animation"
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
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
		class: "model"
	});
	
	select_tab(_tabs.length - 1);
	redraw_tabs();
};

function update_sidebar()
{
	var html, blocks, block, parameter, i, j;
	
	html = "";
	
	
	if (_current_tab != -1)
	{
		if (_tabs[_current_tab].pe)
		{
			blocks = _tabs[_current_tab].pe.getBlocks();
			
			// yeah, this is ugly, but... you expect me to write all those document.createElement()s? you can't be that cruel.
			
			html += "<ul>";
			for (i=0; i<blocks.length; i++)
			{
				block = blocks[i];
				html += "<li class=\"block " + (block.collapsed ? "collapsed" : "") + "\">\n";
				html += "\t<div class=\"title\">\n";
				html += "\t\t" + block.title + "\n";
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
					html += "\t\t<div><label for=\"parameter_" + i + "_" + j + "\">" + parameter.title + ":</label><div class=\"gauge\"><div class=\"used\" style=\"width: " + Math.round(parameter.value / (parameter.max - parameter.min) * 100) + "\">&nbsp;</div></div><input id=\"parameter_" + i + "_" + j + "\" type=\"text\" value=\"" + parameter.value + "\" /><div class=\"unit\">" + parameter.unit + "</div><br class=\"clearer\" /></div>\n";
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
	
	pe = _tabs[_current_tab].pe;
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
	_tabs[_current_tab].pe.setBlockProperty(position, "collapsed", 1);
	update_sidebar();
}

function block_expand(position)
{
	_tabs[_current_tab].pe.setBlockProperty(position, "collapsed", 0);
	update_sidebar();
}

function block_add(block_identifer, position)
{
	_tabs[_current_tab].pe.addBlock(block_identifer, position);
	update_sidebar();
}

function block_remove(position)
{
	_tabs[_current_tab].pe.removeBlock(position);
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
	_current_tab = i;
	update_all();
}

function popup_show(html)
{
	var popup, popup_background, x, y;
	
	popup = document.getElementById("popup");
	popup_background = document.getElementById("popup_background");
	
	popup.innerHTML = html;
	
	x = _mouse_position[0] - 10;
	y = _mouse_position[1] + 10;
	
	if (x + 200 > window.innerWidth)
	{
		x = window.innerWidth - 200;
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
		html += "\t<li><a href=\"#\" onclick=\"" + list[i].js_code + "; popup_hide(); return false;\">" + list[i].title + "</a></li>\n";
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

function handle_mouse_move(event)
{
	// will have no window scrolling on the page
	_mouse_position[0] = event.pageX;
	_mouse_position[1] = event.pageY;
}

function init()
{
	window.onmousemove = handle_mouse_move;
	update_all();
}
