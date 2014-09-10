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
	this.last_mouse_positions = [];
	this.last_left_click = { x: -10, y: -10 };
	this.last_right_click = { x: -10, y: -10 };
	this.selection =  { start: { x: -10, y: -10 }, end: { x: -10, y: -10 } };
	
	this.progress = 0;
	this.state = 1;
	this.player_name = "player-" + Math.floor(Math.random() * 899999 + 100000);
	
	// init
	this.ctx.fillStyle = "#fff";
	this.ctx.font = "10px Verdana";
	this.ctx.fillText("This background canvas is the \"primary\" canvas where the application runs.", 10, 520);
	this.ctx.fillText("The UI is rendered in another canvas placed over this one.", 10, 530);
	
	this.mainMenuCallback = function(selection)
	{
		var tmp;
		
		if (selection == 0)
		{
			// the main menu
			_ui.setOverlay(true);
			_ui.setProgress(1, "Hello " + this.player_name + "!", true);
			_ui.setMenuItems([
				[ "S", "Set name", 1, this.mainMenuCallback.bind(this), 1 ],
				[ "N", "New game", 1, this.mainMenuCallback.bind(this), 2 ],
			], true);
			this.state = 2;
		}
		else if (selection == 1)
		{
			// "Set name"
			tmp = prompt("Player name", this.player_name);
			
			if (tmp)
			{
				this.player_name = tmp;
				this.mainMenuCallback(0);
			}
		}
		else if (selection == 2)
		{
			// "New game"
			_ui.setMenuItems([
				[ "S", "Start", 1, this.mainMenuCallback.bind(this), 11 ],
				[ "X", "Cancel", 1, this.mainMenuCallback.bind(this), 0 ]
			], true);
		}
		else if (selection == 11)
		{
			// "Start", starting the game...
			_ui.setOverlay(false);
			_ui.setProgress(0, "", false);
			_ui.setMenuItems([
				[ "X", "Exit", 1, this.mainMenuCallback.bind(this), 0 ]
			]);
			this.state = 3;
		}
	}
	
	this.draw = function(force)
	{
		var i;
		
		if (force || (Math.random() * 10 < 1 && this.state == 4))
		{
			this.ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ",0.1)";
			this.x = Math.random() * 960 - 300;
			this.y = Math.random() * 540 - 300;
			this.w = Math.random() * 600;
			this.h = Math.random() * 600;
		}
		
		if (this.state == 1)
		{
			this.progress += Math.pow(Math.random() * 1.5, 2);
			if (this.progress < 50)
			{
				_ui.setProgress(this.progress / 100, "Connecting to server", true);
			}
			else if (this.progress < 80)
			{
				_ui.setProgress(this.progress / 100, "Generating assets", true);
			}
			else if (this.progress < 90)
			{
				_ui.setProgress(this.progress / 100, "", true);
			}
			else
			{
				_ui.setProgress(0, "", false);
				
				// display the menu
				this.mainMenuCallback(0);
			}
		}
		else if (this.state == 2)
		{
			// waiting for input...
		}
		else if (this.state == 3)
		{
			// setting up game...
			_ui.setResources(172121, 235667, '48/79');
			
			this.last_mouse_positions = [];
			for (i=0; i<30; i++)
			{
				this.last_mouse_positions.push({ x: 0, y: 0});
			}
			
			this.ctx.fillStyle = "#294";
			this.ctx.fillRect(0, 0, 960, 540);
			this.state = 4;
		}
		else if (this.state == 4)
		{
			this.ctx.strokeStyle = "#fff";
			this.ctx.lineWidth = 2;
			for (i=1; i<this.last_mouse_positions.length; i++)
			{
				this.ctx.beginPath();
				this.ctx.strokeStyle = "rgb(255, " + Math.floor((i/30) * 255) + ", 0)";
				this.ctx.moveTo(this.last_mouse_positions[i-1].x, this.last_mouse_positions[i-1].y);
				this.ctx.lineTo(this.last_mouse_positions[i].x, this.last_mouse_positions[i].y);
				this.ctx.stroke();
			}
			
			this.ctx.rect(this.selection.start.x, this.selection.start.y, this.selection.end.x - this.selection.start.x, this.selection.end.y - this.selection.start.y);
			this.ctx.stroke();
			
			this.ctx.fillRect(this.x, this.y, this.w, this.h);
		}
		_ui.redraw();
	}
	
	this.eventCallback = function(event_type, p1, p2)
	{
		if (event_type == _ui.EVENT_KEY_PRESS)
		{
			
		}
		else if (event_type == _ui.EVENT_MOUSE_CLICK_LEFT)
		{
			
		}
		else if (event_type == _ui.EVENT_MOUSE_MOVE)
		{
			this.last_mouse_positions.push(p1);
			this.last_mouse_positions.shift();
		}
	}
}

function init()
{
	_c = new VeryImportantCanvas("canvas1");
	_ui = new UI("canvas2");
	_ui.registerCallback(_c.eventCallback.bind(_c));
	
	_c.draw(true);
	window.setInterval(_c.draw.bind(_c), 1000 / 60);
}

window.onload = init;
