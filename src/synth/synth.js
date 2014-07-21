/**
  * Mostly based on "The XM module format description for XM files version
  * $0104" by Mr.H of Triton, with fixes from Guru and Alfred of Sahara Surfers.
  * Downloaded from: ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20(.xm).html
  * Also can be found in the repository in the "docs" directory.
  */

/** @constructor */
Synth = function()
{
	this.audio_objects = [];
	
	// DEBUG BEGIN
	this.log = function(s)
	{
		console.log("Synth: " + s);
	}
	// DEBUG END
	
	/** @constructor */
	this.SynthSample = function(sample_data)
	{
		// every SynthSample is in 44100 Hz, mono, signed 16 bit format
		
		// DEBUG BEGIN
		this.name = "";
		// DEBUG END
		
		/** @type Int16Array */
		this.data = sample_data;
		
		this.getDataLength = function()
		{
			return this.data.length;
		}
		
		this.getDataOnPosition = function(pos)
		{
			return this.data[pos];
		}
	}
	
	/** @constructor */
	this.SynthInstrument = function()
	{
		// DEBUG BEGIN
		this.name = "";
		// DEBUG END
		
		this.sample_id = 0;
		this.volume = 0; // 0..64
		this.panning = 128; // 0: left, 128: center, 255: right
		this.finetune = 0;
		this.relative_note_number = 0; // -96..+95, 0 means C-4 = C-4
		
		// only one sample at the moment
		/** @type SynthSample */
		this.sample = null;
		
		this.volume_sustain = 0;
		this.volume_loop = 0;
		this.volume_fadeout = 0;
		
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
	this.SynthChannel = function()
	{
		this.sample = null;
		this.volume = 0; // 0..64
		this.panning = 128;
		this.note = 0;
		this.sample_speed = 0;
		this.sample_position = 0;
		this.sample_loop_type = 1; // 0: none, 1: forward, 2: ping-pong
		this.sample_loop_start = 0;
		this.sample_loop_length = 0;
		this.relative_note_number = 0; // -96..+95, 0 means C-4 = C-4
		this.finished = 0;
		
		// DEBUG BEGIN
		this.log = function(s)
		{
			console.log("SynthChannel: " + s);
		}
		// DEBUG END
		
		this.getFrequency = function(note, finetune)
		{
			var period = 10*12*16*4 - note * 16*4 - finetune / 2;
			return 8363 * Math.pow(2, (6*12*16*4 - period) / (12*16*4));
		}
		
		this.setInstrument = function(instrument)
		{
			this.instrument = instrument;
			this.sample = instrument.sample;
			this.sample_loop_type = instrument.sample_loop_type;
			this.sample_loop_start = instrument.sample_loop_start;
			this.sample_loop_length = instrument.sample_loop_length;
			this.relative_note_number = instrument.relative_note_number;
			this.finetune = instrument.finetune;
			this.sample_position = 0;
			this.log("  instrument: " + instrument);
		}
		
		this.setNote = function(note)
		{
			if (note == 97)
			{
				// this.finished = 1;
				this.volume = 0;
				return;
			}
			// reset the volume and panning
			this.volume = this.instrument.volume;
			this.panning = this.instrument.panning;
			this.note = note;
			this.sample_position = 0;
			this.log("  note: " + note + ", volume: " + this.volume + ", panning: " + this.panning);
		}
		
		this.setVolume = function(volume)
		{
			this.volume = volume;
			this.log("  volume: " + this.volume);
		}
		
		this.getSamplePosition = function()
		{
			var pos = Math.floor(this.sample_position), a;
			
			if (this.sample_loop_type == 1) // forward
			{
				if (pos >= this.sample_loop_start + this.sample_loop_length)
				{
					pos = this.sample_loop_start + (pos - this.sample_loop_start) % this.sample_loop_length;
				}
			}
			else if (this.sample_loop_type == 2) // ping-pong
			{
				if (pos >= this.sample_loop_start + this.sample_loop_length)
				{
					a = pos - this.sample_loop_start;
					a = a % (this.sample_loop_length * 2);
					if (a >= this.sample_loop_length)
					{
						a = this.sample_loop_length - (a % this.sample_loop_length) - 1;
					}
					pos = this.sample_loop_start + a;
				}
			}
			else // no loop
			{
				if (pos >= this.sample.getDataLength())
				{
					pos = -1;
				}
			}
			
			
			return pos;
		}
		
		this.renderNote = function(buffer, pos, length)
		{
			var i, a, speed, pos2;
			
			if (this.sample == null)
			{
				return;
			}
			
			// the notes in XM files seem to be one note off - correcting it here
			speed = this.getFrequency(this.note + this.relative_note_number + this.finetune / 128 - 1, 0) / 44100;
			
			for (i=0; i<length; i++)
			{
				pos2 = this.getSamplePosition();
				
				if (pos2 == -1)
				{
					break;
				}
				
				a = this.sample.getDataOnPosition(pos2);
				
				// volume has a 0.5 multiplier to prevent clipping (note:
				// samples played simultaneously on more channels can still
				// create clipping)
				//
				// left and right channels
				buffer[(pos + i)*2] +=  a * this.volume / 64 * (1 - Math.min(((this.panning - 128) / 128), 1)) * 0.5;
				buffer[(pos + i)*2+1] += a * this.volume / 64 * Math.min(this.panning / 128, 1) * 0.5;
				
				this.sample_position += speed;
			}
		}
	}
	
	/** @constructor */
	this.SynthPattern = function()
	{
		// line format: [ note, instrument, volume, effect type, effect parameters ]
		// notes are 1..96 (1 is C-0, 96 is B-7) and 97 which is key off
		this.length = 0; // row count
		this.number_of_rows;
		this.number_of_channels;
		this.channel_data = [ [], [], [], [] ]; // row data for 4 channels
	}
	
	/** @constructor */
	this.SynthSong = function()
	{
		// DEBUG BEGIN
		this.name = "";
		// DEBUG END
		
		this.bpm = 120;
		this.speed = 3;
		this.audio_object = null;
		this.pattern_order_table = [];
	}
	
	this.render = function(samples, file, dictionary)
	{
		var i, j, k, l, m,
			_samples = [],
			_instruments = [],
			_patterns = [],
			_songs = [],
			file,
			dictionary,
			pos,
			song,
			pattern,
			columns,
			song_count,
			number_of_patterns,
			number_of_channels,
			number_of_instruments,
			number_of_rows,
			song_length;
		
		/* load the samples, instruments and patterns */
		for (i in samples)
		{
			_samples[i] = new this.SynthSample(samples[i]);
		}
		
		song_count = file.readOne();
		number_of_instruments = file.readOne();
		
		for (i=0; i<number_of_instruments; i++)
		{
			_instruments[i] = new this.SynthInstrument();
			_instruments[i].sample_id = file.readOne();
			_instruments[i].sample_loop_type = file.readOne();
			_instruments[i].sample_loop_start = file.readTwo();
			_instruments[i].sample_loop_length = file.readTwo();
			_instruments[i].volume = file.readOne();
			_instruments[i].panning = file.readOne();
			// we store the finetun _unsigned_ and moved up by 128
			_instruments[i].finetune = file.readOne() - 128;
			// we store the relative note number _unsigned_ and moved up by 128
			_instruments[i].relative_note_number = file.readOne() - 128;
			// DEBUG BEGIN
			if (_samples[_instruments[i].sample_id] == undefined)
			{
				console.log("ERROR: sample #" + _instruments[i].sample_id + " is undefined!");
				return false;
			}
			// DEBUG END
			_instruments[i].sample = _samples[_instruments[i].sample_id];
		}
		
		for (i=0; i<song_count; i++)
		{
			song = new this.SynthSong();
			song.bpm = file.readOne();
			song.speed = file.readOne();
			_songs[0] = song;
			
			number_of_patterns = file.readOne();
			number_of_channels = file.readOne();
			song_length = file.readOne();
			
			for (j=0; j<song_length; j++)
			{
				song.pattern_order_table[j] = file.readOne();
			}
			
			for (j=0; j<number_of_patterns; j++)
			{
				pattern = new this.SynthPattern();
				pattern.number_of_channels = number_of_channels;
				// pattern.number_of_channels = 1;
				
				for (k=0; k<number_of_channels; k++)
				{
					number_of_rows = file.readOne();
					pattern.number_of_rows = number_of_rows;
					
					columns = [
						dictionary.getArray(file.readTwo()), // notes
						dictionary.getArray(file.readTwo()), // instruments
						dictionary.getArray(file.readTwo()), // volumes
						dictionary.getArray(file.readTwo()), // effect types
						dictionary.getArray(file.readTwo())  // effect parameters
					];
					for (l=0; l<number_of_rows; l++)
					{
						pattern.channel_data[k][l] = [ columns[0][l], columns[1][l], columns[2][l], columns[3][l], columns[4][l] ];
					}
				}
				_patterns[j] = pattern;
			}
		}
		
		/* render the songs */
		var channels,
			samples_per_tick,
			data,
			tmp;
		
		// hardcoded to 32 channels, the maximum of an XM file
		// TODO: make it dynamic?
		channels = [];
		for (i=0; i<32; i++)
		{
			channels[i] = new this.SynthChannel();
		}
		
		for (i in _songs)
		{
			song = _songs[i];
			data = [];
			
			// this is just an approximation, I could not get my head over the correct calculation...
			// TODO: make a correct calculation for this
			samples_per_tick = Math.round((1 / song.bpm * 2.501129) * 44100);
			
			// leave the first 44 bytes empty for the WAVE header
			// = 11 samples, 2 channels, 2 bytes
			pos = 11;
			
			for (j in song.pattern_order_table)
			{
				pattern = _patterns[song.pattern_order_table[j]];
				
				for (k=0; k<pattern.number_of_rows; k++)
				{
					// Note: it is important to have the setup separated from
					// render as command effects can effect the whole song not
					// just their channels
					for (m=0; m<pattern.number_of_channels; m++)
					{
						this.log("rendering pattern: row: " + k + ", pos: " + pos + ", time: " + Math.round(pos / 44100 * 1000) + "ms, ticks: " + song.speed + ", channel: " + m + ", row data: " + pattern.channel_data[m][k]);
						
						// NNA is "cut"
						pattern.channel_data[m][k][1] && channels[m].setInstrument(_instruments[pattern.channel_data[m][k][1] - 1]);
						pattern.channel_data[m][k][0] && channels[m].setNote(pattern.channel_data[m][k][0]);
						pattern.channel_data[m][k][2] && channels[m].setVolume(pattern.channel_data[m][k][2] - 16);
					}
					
					// initialize the buffer for this row
					for (l=0; l<samples_per_tick * song.speed; l++)
					{
						data[(pos + l) * 2] = 0;
						data[(pos + l) * 2 + 1] = 0;
					}
					
					for (l=0; l<song.speed; l++)
					{
						for (m=0; m<pattern.number_of_channels; m++)
						{
							channels[m].renderNote(data, pos, samples_per_tick);
						}
						pos += samples_per_tick;
					}
				}
			}
			
			data2 = new Int16Array(data);
			
			/* prepare the WAV file, create the headers */
			var used = data2.length*2, dv = new Uint32Array(data2.buffer, 0, 44);
			
			dv[0] = 0x46464952; // "RIFF"
			dv[1] = used + 36;  // total file size
			dv[2] = 0x45564157; // "WAVE"
			dv[3] = 0x20746D66; // "fmt " chunk
			dv[4] = 0x00000010; // size of the following
			dv[5] = 0x00020001; // format: PCM, channels: 2
			dv[6] = 0x0000AC44; // samples per second: 44100
			dv[7] = 0x00015888; // byte rate: two bytes per sample
			dv[8] = 0x00100002; // data align: 2 bytes, bits per sample: 16 bits
			dv[9] = 0x61746164; // "data" chunk
			dv[10] = used;      // number of samples
			
			/* encode the WAV file to a data URL with base64 encoding and create the player HTML object */
			this.audio_objects[i] = new Audio("data:audio/wav;base64," + base64_encode(new Uint8Array(data2.buffer, 0, data2.length * 2)));
		}
	}
	
	this.play = function(song_id)
	{
		/* play the generated sound */
		this.audio_objects[song_id].play();
	}
}
