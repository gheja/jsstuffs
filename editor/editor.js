var _tabs = [];
var _current_tab = 0;

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

function create_sample_tab()
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
	
	redraw_tabs();
};

function create_instrument_tab()
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
	
	redraw_tabs();
};

function create_skeleton_tab()
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
	
	redraw_tabs();
};

function create_skeletal_animation_tab()
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
	
	redraw_tabs();
};

function create_model_tab()
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
	
	redraw_tabs();
};

function create_sample_tab()
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
	
	redraw_tabs();
}

function update_sidebar()
{
	var html, blocks, block, parameter, i, j;
	
	blocks = _tabs[_current_tab].pe.getBlocks();
	
	// yeah, this is ugly, but... writing all those document.createElement()s, really?...
	
	html = "<ul>";
	for (i=0; i<blocks.length; i++)
	{
		block = blocks[i];
		html += "<li class=\"block " + (block.collapsed ? "collapsed" : "") + "\">\n";
		html += "\t<div class=\"title\">\n";
		html += "\t\t" + block.title + "\n";
		html += "\t\t<div class=\"buttons\">\n";
		html += "\t\t\t<a href=\"#\" onclick=\"block_expand(" + i + "); return false;\" class=\"button expand\" title=\"Expand\">&#9606;</a>\n";
		html += "\t\t\t<a href=\"#\" onclick=\"block_collapse(" + i + "); return false;\" class=\"button collapse\" title=\"Collapse\">&#9602;</a>\n";
		html += "\t\t\t<a href=\"#\" onclick=\"popup_block_remove(" + i + "); return false;\" class=\"button\" title=\"Remove this block\">x</a>\n";
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
	html += "<a href=\"#\" onclick=\"popup_block_add(9999); return false;\"title=\"Add item here\">+</a>\n";
	
	document.getElementById("sidebar").innerHTML = html;
}

function popup_block_add(i)
{
	var i, pe, blocks, list;
	
	pe = _tabs[_current_tab].pe;
	blocks = pe.getBuildingBlocks();
	
	list = [];
	for (i=0; i<blocks.length; i++)
	{
		list.push({ js_code: "_tabs[_current_tab].addBlock(" + blocks[i].block_identifier + "," + i + "); update_sidebar();", title: blocks[i].title });
	}
	popup_list(list);
}

function block_collapse(i)
{
	_tabs[_current_tab].pe.setBlockProperty(i, "collapsed", 1);
	update_sidebar();
}

function block_expand(i)
{
	_tabs[_current_tab].pe.setBlockProperty(i, "collapsed", 0);
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
	document.getElementById("popup").innerHTML = html;
	document.getElementById("popup_background").style.display = "block";
	document.getElementById("popup").style.display = "block";
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
		{ js_code: "create_sample_tab();", title: "New sample" },
		{ js_code: "create_instrument_tab();", title: "New instrument" },
		{ js_code: "create_skeleton_tab();", title: "New skeleton" },
		{ js_code: "create_skeletal_animation_tab();", title: "New skeletal animation" },
		{ js_code: "create_model_tab();", title: "New model" }
	]);
}

function init()
{
	update_all();
}
