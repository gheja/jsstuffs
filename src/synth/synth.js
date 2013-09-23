/**
  * Mostly based on "The XM module format description for XM files version
  * $0104" by Mr.H of Triton, with fixes from Guru and Alfred of Sahara Surfers.
  * Downloaded from: ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20(.xm).html
  * Also can be found in the repository in the "docs" directory.
  */

/** @constructor */
Synth = function()
{
	this.samples = [];
	this.instruments = [];
	this.patterns = [];
	this.songs = [];
	this.audio_objects = [];
	
	/** @constructor */
	this.SynthSample = function()
	{
		// every SynthSample is in 44100 Hz, mono, signed 16 bit sounds
		
		// DEBUG BEGIN
		this.name = "";
		// DEBUG END
		
		this.volume = 0;
		this.fine_tune = 0;
		this.pan = 0;
		this.loop_start = 0;
		this.loop_length = 0;
		this.sample_loop_type = 0; // 0: none, 1: forward, 2: ping-pong
		this.relative_note_number = 32; // -96..+95, 0 means C-4 = C-4
		
		/** @type Int16Array */
		this.samples = null; // sample data
		
		this.loadBase64RawData = function(encoded_data)
		{
			this.samples = base64_to_int16array(encoded_data);
		}
		
		this.getDataOnPosition = function(pos)
		{
			// forward loop
			return this.samples[Math.round(pos) % this.samples.length];
		}
	}
	
	/** @constructor */
	this.SynthInstrument = function()
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
		
		/*
		this.loadBase64RawData = function(encoded_data)
		{
		}
		*/
	}
	
	/** @constructor */
	this.SynthChannel = function()
	{
		this.sample = null;
		this.note = 0;
		this.sample_speed = 0;
		this.volume = 0;
		this.pan = 128; // 0: left, 128: center, 255: right
		this.sample_position = 0;
		this.finished = 0;
		
/*
		this.loadBase64RawData = function(encoded_data)
		{
		}
*/
		this.getFrequency = function(note, finetune)
		{
			var period = 10*12*16*4 - note * 16*4 - finetune / 2;
			return 8363 * Math.pow(2, (6*12*16*4 - period) / (12*16*4));
		}
		
		this.setInstrument = function(instrument)
		{
			this.sample = instrument.sample;
			this.volume = instrument.volume;
			this.sample_position = 0;
			console.log("  instrument: " + instrument + ", volume: " + this.volume);
		}
		
		this.setNote = function(note)
		{
			if (note == 97)
			{
				// this.finished = 1;
				this.volume = 0;
				return;
			}
			this.note = note;
			this.sample_position = 0;
			console.log("  note: " + note);
		}
		
		this.setVolume = function(volume)
		{
			this.volume = volume;
			console.log("  volume: " + volume);
		}
		
		this.renderNote = function(buffer, pos, length)
		{
			var i, speed = this.getFrequency(this.note + this.sample.relative_note_number, 0) / 44100;
			
			for (i=0; i<length; i++)
			{
				// left and right channels
				buffer[(pos + i)*2] = this.sample.getDataOnPosition(this.sample_position) * this.volume / 64;
				buffer[(pos + i)*2+1] = this.sample.getDataOnPosition(this.sample_position) * this.volume / 64;
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
		this.data = []; // row data
		
		/*
		this.loadBase64RawData = function(encoded_data)
		{
		}
		*/
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
		this.patterns = [];
		
		/*
		this.loadBase64RawData = function(encoded_data)
		{
		}
		*/
	}
	
	this.render = function(samples, file_base64, dictionary_base64)
	{
		var i;
		
		/* load the samples, instruments and patterns */
		for (i in samples)
		{
			this.samples[i] = new this.SynthSample();
			this.samples[i].loadBase64RawData(samples[i]);
		}
		
		this.instruments[1] = new this.SynthInstrument();
		this.instruments[1].volume = 64;
		this.instruments[1].sample = this.samples[0];
		
		file = base64_decode(file_base64);
		dictionary = new Dictionary();
		dictionary.setContents(base64_decode(dictionary_base64));
		
		pos = 0;
		song_count = file[pos++];
		for (i=0; i<song_count; i++)
		{
			song = new this.SynthSong();
			song.bpm = file[pos++];
			song.speed = file[pos++];
			this.songs[0] = song;
			
			number_of_patterns = file[pos++];
			number_of_channels = file[pos++];
			number_of_instruments = file[pos++];
			song_length = file[pos++];
			
			for (j=0; j<song_length; j++)
			{
				song.patterns[j] = file[pos++];
			}
			
			for (j=0; j<number_of_patterns; j++)
			{
				number_of_rows = file[pos++];
				
				pattern = new this.SynthPattern();
				columns = [
					dictionary.getArray(file[pos++] + file[pos++] * 256), // notes
					dictionary.getArray(file[pos++] + file[pos++] * 256), // instruments
					dictionary.getArray(file[pos++] + file[pos++] * 256), // volumes
					dictionary.getArray(file[pos++] + file[pos++] * 256), // effect types
					dictionary.getArray(file[pos++] + file[pos++] * 256)  // effect parameters
				];
				for (l=0; l<number_of_rows; l++)
				{
					pattern.data[l] = [ columns[0][l], columns[1][l], columns[2][l], columns[3][l], columns[4][l] ];
				}
				this.patterns[j] = pattern;
			}
		}
		
		/* render the songs */
		var j, k, l,
			channels,
			pos,
			samples_per_tick,
			data,
			tmp,
			song,
			pattern;
		
		for (i in this.songs)
		{
			song = this.songs[i];
			data = [];
			
			// samples per seconds / beats per sec / speed
			// samples_per_tick = Math.round(44100 / (song.bpm / 60 / song.speed * 12 / 3));
			samples_per_tick = Math.round(44100 / (song.bpm / song.speed));
			
			channels = [ new this.SynthChannel() ];
			
			// leave the first 44 bytes empty (= 11 samples, 2 channels, 2 bytes)
			pos = 11;
			
			for (j in song.patterns)
			{
				pattern = this.patterns[song.patterns[j]];
				
				for (k=0; k<pattern.data.length; k++)
				{
					// NNA is "cut"
					console.log("rendering pattern: row: " + k + ", pos: " + pos + ", time: " + Math.round(pos / 44100 * 1000) + "ms, row data: " + pattern.data[k]);
					
					pattern.data[k][0] && channels[0].setNote(pattern.data[k][0]);
					pattern.data[k][1] && channels[0].setInstrument(this.instruments[pattern.data[k][1]]);
					pattern.data[k][2] && channels[0].setVolume(pattern.data[k][2]);
					
					for (l=0; l<song.speed; l++)
					{
						channels[0].renderNote(data, pos, samples_per_tick);
						pos += samples_per_tick;
					}
				}
			}
			
			data2 = new Int16Array(data);
		}
		
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
		this.audio_objects[0] = new Audio("data:audio/wav;base64," + base64_encode(new Uint8Array(data2.buffer, 0, data2.length * 2)));
	}
	
	this.play = function(song_id)
	{
		/* play the generated sound */
		this.audio_objects[song_id].play();
	}
}
