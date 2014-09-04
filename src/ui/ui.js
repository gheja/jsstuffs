UI = function(canvas_name)
{
	this.colors = [ "rgba(0, 0, 0, 0.25)", "#fff", "#ff0", "#0c0", "#22c" ];
	this.menu_items = [];
	
	this.canvas = document.getElementById(canvas_name);
	this.ctx = this.canvas.getContext("2d");
	
	canvas_2d_extend(this.ctx);
	
	this.setColor = function(id, color)
	{
		this.colors[id] = color;
	}
	
	this.setMenuItems = function(items)
	{
		this.menu_items = items;
	}
	
	this.redraw = function(resource_text1, resource_text2, resource_text3)
	{
		var i, w, h, l, item;
		
		w = this.canvas.width;
		h = this.canvas.height;
		l = this.menu_items.length;
		
		this.ctx.clearRect(0, 0, w, h);
		
		for (i=0; i<l; i++)
		{
			item = this.menu_items[i];
			
			this.ctx.drawBackgroundBox(w - 150, h - (l - i) * 32, 148, 30);
			this.ctx.drawBox(w - 150, h - (l - i) * 32, 30, 30, item[2] ? this.colors[4] : this.colors[0]);
			
			this.ctx.drawText(w - 150 + 15, h - (l - i) * 32 + 24, item[0], item[2] ? this.colors[1] : this.colors[0], 1, 1, 1, 0);
			this.ctx.drawText(w - 120 + 4, h - (l - i) * 32 + 24, item[1], item[2] ? this.colors[1] : this.colors[0], 1, 0, 0, 1);
		}
		
		this.ctx.drawBackgroundBox(w - 304, 0, 320, 26);
		
		this.ctx.drawText(w - 300, 20, resource_text1, this.colors[2], 0, 0, 0, 1);
		this.ctx.drawText(w - 200, 20, resource_text2, this.colors[3], 0, 0, 0, 1);
		this.ctx.drawText(w - 100, 20, resource_text3, this.colors[1], 0, 0, 0, 1);
	}
}
