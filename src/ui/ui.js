UI = function(canvas_name)
{
	var PI2 = Math.PI * 2;
	var PI05 = Math.PI / 2;
	
	/* *** ui drawing *** */
	
	this.colors = [ "rgba(0, 0, 0, 0.25)", "#fff", "#ff0", "#0c0", "#333" ];
	this.menu_items = [];
	this.menu_above_overlay = false;
	this.resources = [ 0, 0, 0 ];
	
	this.canvas = document.getElementById(canvas_name);
	this.ctx = this.canvas.getContext("2d");
	this.dirty = true;
	this.overlay = true;
	this.progress_show = true;
	this.progress_progress = 1;
	this.progress_text = "";
	this.progress_play = false;
	
	canvas_2d_extend(this.ctx);
	
	this.setColor = function(id, color)
	{
		this.dirty = true;
		this.colors[id] = color;
	}
	
	this.setMenuItems = function(items, above_overlay)
	{
		this.dirty = true;
		this.menu_items = items;
		this.menu_above_overlay = above_overlay;
	}
	
	this.setResources = function(resource_text1, resource_text2, resource_text3)
	{
		this.dirty = true;
		this.resources = [ resource_text1, resource_text2, resource_text3 ];
	}
	
	this.setOverlay = function(value)
	{
		this.dirty = true;
		this.overlay = value;
	}
	
	this.setProgress = function(progress, text, show, play)
	{
		this.dirty = true;
		this.progress_show = show;
		this.progress_progress = progress;
		this.progress_text = text;
		this.progress_play = play;
	}
	
	this.redraw = function()
	{
		var i, w, h, l, item;
		
		if (!this.dirty)
		{
			return;
		}
		
		this.dirty = false;
		
		w = this.canvas.width;
		h = this.canvas.height;
		l = this.menu_items.length;
		
		this.ctx.clearRect(0, 0, w, h);
		
		if (this.overlay)
		{
			// draw overlay
			this.ctx.fillStyle = "rgba(0,0,0,0.75)";
			this.ctx.fillRect(0, 0, w, h);
		}
		else
		{
			// draw the selection
			if (this.input.mouse_left_down_position.x != -1 && this.input.mouse_moved)
			{
				this.ctx.beginPath();
				this.ctx.fillStyle = "rgba(255,255,255,0.3)";
				this.ctx.strokeStyle = "rgba(255,255,255,0.8)";
				this.ctx.rect(this.input.mouse_left_down_position.x-0.5, this.input.mouse_left_down_position.y-0.5, this.input.mouse_position.x - this.input.mouse_left_down_position.x, this.input.mouse_position.y - this.input.mouse_left_down_position.y);
				this.ctx.fill();
				this.ctx.stroke();
			}
			
			// draw resources
			this.ctx.drawBackgroundBox(w - 304, 2, 302, 26);
			this.ctx.drawText(w - 300, 20, this.resources[0], this.colors[2], 0, 0, 0, 1);
			this.ctx.drawText(w - 200, 20, this.resources[1], this.colors[3], 0, 0, 0, 1);
			this.ctx.drawText(w - 100, 20, this.resources[2], this.colors[1], 0, 0, 0, 1);
		}
		
		// draw menu
		if (this.menu_above_overlay || !this.overlay)
		{
			for (i=0; i<l; i++)
			{
				item = this.menu_items[i];
				
				this.ctx.drawBackgroundBox(w - 150, h - (l - i) * 32, 148, 30);
				this.ctx.drawBox(w - 150, h - (l - i) * 32, 30, 30, item[2] ? this.colors[4] : this.colors[0]);
				
				this.ctx.drawText(w - 150 + 15, h - (l - i) * 32 + 24, item[0], item[2] ? this.colors[1] : this.colors[0], 1, 1, 1, 0);
				this.ctx.drawText(w - 120 + 4, h - (l - i) * 32 + 24, item[1], item[2] ? this.colors[1] : this.colors[0], 1, 0, 0, 1);
			}
		}
		
		// draw progress bar
		if (this.progress_show)
		{
			this.ctx.beginPath();
			this.ctx.lineWidth = 8;
			this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
			this.ctx.arc(w/2, h/2, 25, 0, PI2, 0);
			this.ctx.stroke();
			
			this.ctx.beginPath();
			this.ctx.strokeStyle = "#fff";
			this.ctx.arc(w/2, h/2, 25, -PI05, -PI05 + PI2 * this.progress_progress, 0);
			this.ctx.stroke();
			
			this.ctx.font = "18px Verdana";
			this.ctx.textAlign = "center";
			this.ctx.fillStyle = "#fff";
			this.ctx.fillText(this.progress_text, w/2, h/2 + 60);
			
			if (this.progress_play)
			{
				this.ctx.font = "36px Arial";
				this.ctx.fillText("\u25BA", w/2 + 3, h/2 + 12);
			}
		}
	}
	
	
	
	/* *** event handling *** */
	
	/** @const */ this.EVENT_KEY_PRESS = 1;
	/** @const */ this.EVENT_KEY_REPEAT = 2;
	/** @const */ this.EVENT_MOUSE_MOVE = 3;
	/** @const */ this.EVENT_MOUSE_CLICK_LEFT = 4;
	/** @const */ this.EVENT_MOUSE_CLICK_RIGHT = 5;
	/** @const */ this.EVENT_MOUSE_DRAG_LEFT = 6;
	
	this.input = {
		keys_pressed: [],
		mouse_position: { x: 0, y: 0 },
		mouse_moved: false, // if the mouse has moved since last button press (dragging?)
		mouse_left_down_position: { x: -1, y: -1 },
		mouse_right_down_position: { x: -1, y: -1 }
	};
	
	this.event_callback = function(){};
	
	this.registerCallback = function(callback)
	{
		this.event_callback = callback;
	}
	
	this.callCallback = function(forced, p1, p2, p3)
	{
		var i;
		
		// before passing the event to the callback check the current menu items
		if (!this.overlay || this.menu_above_overlay)
		{
			for (i=0; i<this.menu_items.length; i++)
			{
				// if menu item is enabled
				if (this.menu_items[i][2])
				{
					// check if the hotkey was pressed
					// TODO: mouse click check
					if (p1 == this.EVENT_KEY_PRESS && String.fromCharCode(p2).toUpperCase() == this.menu_items[i][0])
					{
						// then call the menu item callback
						this.menu_items[i][3](this.menu_items[i][4]);
						
						// do NOT call the event callback
						return;
					}
				}
			}
		}
		
		if (forced || !this.overlay)
		{
			this.event_callback(p1, p2, p3);
		}
	}
	
	this.onMouseMove = function(event)
	{
		var a, x, y, moved;
		
		this.dirty = true;
		
		a = this.canvas.getBoundingClientRect();
		x = event.clientX - a.left;
		y = event.clientY - a.top;
		moved = (this.input.mouse_moved || x != this.input.mouse_position.x || y != this.input.mouse_position.y);
		
		this.input.mouse_position.x = x;
		this.input.mouse_position.y = y;
		this.input.mouse_moved = moved;
		
		this.callCallback(false, this.EVENT_MOUSE_MOVE, this.glizeCoordinates(this.input.mouse_position));
		
		event.preventDefault();
	}
	
	this.onMouseDown = function(event)
	{
		this.onMouseMove(event);
		
		// right button?
		if (event.which == 3 || event.button == 2)
		{
			this.input.mouse_right_down_position.x = this.input.mouse_position.x;
			this.input.mouse_right_down_position.y = this.input.mouse_position.y;
		}
		else
		{
			// reset the mouse_moved flag in case of left button only
			this.input.mouse_moved = false;
			
			this.input.mouse_left_down_position.x = this.input.mouse_position.x;
			this.input.mouse_left_down_position.y = this.input.mouse_position.y;
		}
		
		event.preventDefault();
	}
	
	this.glizeCoordinates = function(p)
	{
		return { x: p.x, y: p.y, glx: (p.x - this.canvas.width / 2) / (this.canvas.width / 2), gly: - (p.y - this.canvas.height / 2) / (this.canvas.height / 2) };
	}
	
	this.onMouseUp = function(event)
	{
		this.onMouseMove(event);
		
		// right button?
		if (event.which == 3 || event.button == 2)
		{
			// no dragging with right button
			this.callCallback(false, this.EVENT_MOUSE_CLICK_RIGHT, this.glizeCoordinates(this.input.mouse_position));
			this.input.mouse_right_down_position.x = -1;
			this.input.mouse_right_down_position.y = -1;
		}
		else
		{
			if (this.input.mouse_moved)
			{
				this.callCallback(false, this.EVENT_MOUSE_DRAG_LEFT, this.glizeCoordinates(this.input.mouse_left_down_position), this.glizeCoordinates(this.input.mouse_position));
			}
			else
			{
				this.callCallback(false, this.EVENT_MOUSE_CLICK_LEFT, this.glizeCoordinates(this.input.mouse_position));
			}
			this.input.mouse_left_down_position.x = -1;
			this.input.mouse_left_down_position.y = -1;
		}
		
		event.preventDefault();
	}
	
	this.onContextMenu = function(event)
	{
		// ignore the context menu if the call is coming from the mouse
		if (event.which == 3 || event.button == 2)
		{
			event.preventDefault();
		}
	}
	
	this.onKeyDown = function(event)
	{
		var key;
		key = event.which ? event.which : event.keyCode;
		this.input.keys_pressed[key] = true;
		this.callCallback(false, this.EVENT_KEY_PRESS, key);
	}
	
	this.onKeyUp = function(event)
	{
		var key;
		key = event.which ? event.which : event.keyCode;
		this.input.keys_pressed[key] = false;
	}
	
	this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this), false);
	this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this), false);
	this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this), false);
	this.canvas.addEventListener("contextmenu", this.onContextMenu.bind(this), false);
	window.addEventListener("keydown", this.onKeyDown.bind(this), false);
	window.addEventListener("keyup", this.onKeyUp.bind(this), false);
}
