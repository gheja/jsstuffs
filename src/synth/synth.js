/**
  * Mostly based on "The XM module format description for XM files version
  * $0104" by Mr.H of Triton, with fixes from Guru and Alfred of Sahara Surfers.
  * Downloaded from: ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20(.xm).html
  * Also can be found in the repository in the "docs" directory.
  */

/** @constructor */
// every SynthSample is in 44100 Hz, mono, signed 16 bit sounds
SynthSample = function()
{
	// DEBUG BEGIN
	this.name = "";
	// DEBUG END
	
	this.volume = 0;
	this.fine_tune = 0;
	this.pan = 0;
	this.loop_start = 0;
	this.loop_length = 0;
	this.sample_loop_type = 0; // 0: none, 1: forward, 2: ping-pong
	this.relative_note_number = 0; // -96..+95, 0 means C-4 = C-4
	// this.length = 0; // sample count, == this.samples.length
	
	/** @type Int16Array */
	this.samples = null; // sample data
	
	this.loadBase64RawData = function(encoded_data)
	{
		var i, data = atob(encoded_data);
		this.samples = new Int16Array(data.length / 2);
		for (i=0; i<data.length/2; i++)
		{
			this.samples[i] = data.charCodeAt(i*2+1) * 256 + data.charCodeAt(i*2);
		}
	}
}

/** @constructor */
SynthInstrument = function()
{
	// DEBUG BEGIN
	this.name = "";
	// DEBUG END
	
	// only one sample at the moment
	/** @type SynthSample */
	this.sample = null;
	
	this.volume = 0;
	this.volume_sustain = 0;
	this.volume_loop = 0;
	this.volume_fadeout = 0;
	
	this.pan = 0;
	this.pan_sustain = 0;
	this.pan_loop = 0;
	
	/*
	this.vibratio_type = 0;
	this.vibratio_sweep = 0;
	this.vibratio_depth = 0;
	this.vibratio_rate = 0;
	*/
}

/** @constructor */
SynthPattern = function()
{
	// notes are 1..96 (1 is C-0, 96 is B-7) and 97 which is key off
	this.length = 0; // note count
	this.data = []; // note data
}

/** @constructor */
SynthChannel = function()
{
	var sample_position;
	
	this.reset = function()
	{
	}
}

/** @constructor */
SynthSong = function()
{
	// DEBUG BEGIN
	this.name = "";
	// DEBUG END
	
	// this.tempo = 0; // ?
	this.bpm = 120;
	this.audio_object = null;
	
	this.render = function()
	{
		// this.audio_object = new Audio("data:audio/wav;base64," + header and rendered data);
	}
}
