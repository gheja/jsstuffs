var _last_generated_sample = [];

function _get_wave_url(obj)
{
	var data2 = new Int16Array(_last_generated_sample);
	var used = data2.length*2;
	var dv = new Uint32Array(data2.buffer, 0, 44);
	var player;
	
	/* prepare the WAV file, create the headers */
	
	dv[0] = 0x46464952; // "RIFF"
	dv[1] = used + 36;  // total file size
	dv[2] = 0x45564157; // "WAVE"
	dv[3] = 0x20746D66; // "fmt " chunk
	dv[4] = 0x00000010; // size of the following
	dv[5] = 0x00010001; // format: PCM, channels: 1
	dv[6] = 0x0000AC44; // samples per second: 44100
	dv[7] = 0x00015888; // byte rate: two bytes per sample
	dv[8] = 0x00100002; // data align: 2 bytes, bits per sample: 16 bits
	dv[9] = 0x61746164; // "data" chunk
	dv[10] = used;      // number of samples
	
	/* encode the WAV file to a data URL with base64 encoding and create the player HTML object */
	return "data:audio/wav;base64," + base64_encode(new Uint8Array(data2.buffer, 0, data2.length * 2));
}

function render_samples(canvas, wave, type, last)
{
	var ctx = canvas.getContext("2d");
	var scale = clamp(document.getElementById("zoom").value / 10, 1, 10000);
	var i, j;
	
	canvas.width = canvas.parentNode.clientWidth;
	canvas.height = 104;
	
	j = Math.min(canvas.width, wave.length / scale);
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "rgba(0,0,0,0.66)";
	ctx.fillRect(j, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.moveTo(0, 52 - wave[0]/32768 * 50);
	for (i=0; i<j; i++)
	{
		ctx.lineTo(i, 52 - wave[(i*scale) | 0] / 32768 * 50);
	}
	
	ctx.strokeStyle = last ? "#0f0" : (type < 50 ? "#fff" : (type < 100 ? "#777" : "#ff0"));
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}

function update_all()
{
	var container = document.getElementById("container");
	var blocks = container.getElementsByClassName("block");
	var i, j, k, tmp, data, block, inputs, canvases, type, last;
	
	for (k=0; k<blocks.length; k++)
	{
		data = new ArbitaryArray([], 256);
		for (i=0; i<=k; i++)
		{
			inputs = blocks[i].getElementsByTagName("input");
			if (inputs.length == 0)
			{
				continue;
			}
			
			type = inputs[0].value;
			
			for (j=0; j<inputs.length; j++)
			{
				if (inputs[j].className == "one")
				{
					data.add(inputs[j].value | 0);
				}
				else
				{
					data.add(inputs[j].value & 0xFF);
					data.add(inputs[j].value >> 8);
				}
			}
		}
		
		last = k == blocks.length-1;
		tmp = new SynthSampleGenerator(data, (type >= 100) || last);
		canvases = blocks[k].getElementsByTagName("canvas");
		render_samples(canvases[0], tmp, type, last);
	}
	
	_last_generated_sample = tmp;
}

function handle_input_blur(event)
{
	var a = this.value | 0;
	
	if (this.className == "one")
	{
		a = Math.min(255, Math.max(0, a));
	}
	else if (this.className == "two")
	{
		a = Math.min(65535, Math.max(0, a));
	}
	else if (this.className == "zoom")
	{
		a = Math.min(10000, Math.max(1, a));
	}
	
	if (this.value !== a)
	{
		this.value = a;
		update_all();
	}
}

function handle_input_mousewheel(event)
{
	var a = this.value | 0;
	if (event.wheelDelta < 0)
	{
		a -= 5;
	}
	else if (event.wheelDelta > 0)
	{
		a += 5;
	}
	else
	{
		return;
	}
	
	if (this.className == "one")
	{
		a = Math.min(255, Math.max(0, a));
	}
	else if (this.className == "two")
	{
		a = Math.min(65535, Math.max(0, a));
	}
	else if (this.className == "zoom")
	{
		a = Math.min(10000, Math.max(1, a));
	}
	
	this.value = a;
	
	event.preventDefault();
	
	update_all();
}

function clone_block(id)
{
	var obj = document.getElementById("prototype_" + id);
	var obj2 = obj.cloneNode(true);
	obj2.style.display = "block";
	obj2.id = "";
	
	var inputs = obj2.getElementsByTagName("input");
	var i;
	for (i=0; i<inputs.length; i++)
	{
		inputs[i].addEventListener("mousewheel", handle_input_mousewheel, false);
		inputs[i].addEventListener("blur", handle_input_blur, false);
	}
	
	canvas = document.createElement("canvas");
	obj2.appendChild(canvas);
	
	document.getElementById("container_dynamic").appendChild(obj2);
	
	update_all();
}

function kill_block(obj)
{
	if (!confirm("Are you sure?"))
	{
		return false;
	}
	
	obj.parentNode.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode.parentNode);
}
function play_block(obj)
{
	var player = new Audio(_get_wave_url(obj));
	player.play();
}
function save_block(obj)
{
	window.open(_get_wave_url(obj));
}
function init()
{
	var obj = document.getElementById("zoom");
	obj.addEventListener("mousewheel", handle_input_mousewheel, false);
	obj.addEventListener("blur", handle_input_blur, false);
}

window.onload = init;
