var _c, _ui;

/* this is just a sample canvas that draws some dummy thing */
VeryImportantCanvas = function(canvas_name)
{
	this.canvas = document.getElementById(canvas_name);
	this.ctx = this.canvas.getContext("2d");
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.ctx.fillStyle = "#294";
	this.ctx.fillRect(0, 0, 960, 540);
	
	this.ctx.fillStyle = "#fff";
	this.ctx.font = "10px Verdana";
	this.ctx.fillText("This background canvas is the \"primary\" canvas where the application runs.", 10, 520);
	this.ctx.fillText("The UI is rendered in another canvas placed over this one.", 10, 530);
	
	this.draw = function(force)
	{
		if (force || Math.random() * 10 < 1)
		{
			this.ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ",0.1)";
			this.x = Math.random() * 960 - 300;
			this.y = Math.random() * 540 - 300;
			this.w = Math.random() * 600;
			this.h = Math.random() * 600;
		}
		
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

function ui_refresh()
{
	_ui.setMenuItems([
		[ "A", "Attack", 1 ],
		[ "M", "Move", 1 ],
		[ "S", "Stop", 0 ],
		[ "G", "Gather", 1 ],
		[ "B", "Build", 1 ],
		[ "P", "Patrol", 1 ]
	]);
	
	_ui.redraw(1, 2, 3);
}


function init()
{
	_c = new VeryImportantCanvas("canvas1");
	_c.draw(true);
	window.setInterval(_c.draw.bind(_c), 1000 / 60);
	
	_ui = new UI("canvas2");
	ui_refresh();
}

window.onload = init;
