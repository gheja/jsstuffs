SynthXmConverter = function()
{
	this.xm_structures = [];
	this.dictionary = new Dictionary();
	this.generated_data = null;
	this.instrument_titles = [];
	
	this.log = function(s)
	{
		console.log("SynthXmConverter: " + s);
	}
	
	this.readFile = function(data)
	{
		var xm_reader = new SynthXmReader();
		
		try
		{
			if (!xm_reader.readFile(data))
			{
				return false;
			}
		}
		catch (e)
		{
			this.log("Exception: " + e);
			return false;
		}
		
		xm_reader.unpackPatternRows();
		
		this.xm_structures.push(xm_reader.getXmStructure());
		
		return true;
	}
	
	this.processFiles = function()
	{
		var i, j, k, l, m,
			found = 0,
			index = -1,
			channels = 0,
			pattern_column_dictionary = [],
			pattern_column_map = [],
			instruments = [],
			samples = [],
			pattern,
			instrument,
			sample,
			a = 0,
			b,
			found,
			instrument_titles,
			instrument_remap_table,
			new_instrument_id;
		
		this.log("Processing " + this.xm_structures.length + " songs...");
		
		this.log("Processing instruments, creating instrument remap table...");
		
		k = 0;
		found = -1;
		instrument_titles = []; // [instrument_id] = title
		instrument_remap_table = []; // [song_id][instrument_id] = new_instrument_id
		new_instrument_id = 0;
		for (i in this.xm_structures)
		{
			instrument_remap_table[i] = [];
			for (j in this.xm_structures[i].instruments)
			{
				this.log("  song #" + i + ", instrument #" + j);
				instrument = this.xm_structures[i].instruments[j];
				
				if (instrument.name == "                      ")
				{
					this.log("    WARNING: instrument name is empty - cannot deduplicate multiple instances of it.");
					instrument_remap_table[i][j] = new_instrument_id;
					instrument_titles[new_instrument_id] = instrument.name;
					new_instrument_id++;
					continue;
				}
				
				found = -1;
				for (k in instrument_titles)
				{
					if (instrument_titles[k] == instrument.name)
					{
						found = k;
						break;
					}
				}
				
				if (found != -1)
				{
					instrument_remap_table[i][j] = k;
				}
				else
				{
					instrument_remap_table[i][j] = new_instrument_id;
					instrument_titles[new_instrument_id] = instrument.name;
					new_instrument_id++;
				}
				
				
				/* do not handle the actual sample data as it will be generated by the synth
				if (instrument.number_of_samples > 1)
				{
					this.log("WARNING: instruments with more than one sample are unsupported - reading the first sample only.");
					// TODO: create new instruments for multi-sample instruments here
				}
				
				if (instrument.samples[0].type & 8)
				{
					this.log("WARNING: 16-bit samples are unsupported yet - skipping this sample.");
					continue;
				}
				
				if (instrument.samples[0].compression_type != 0)
				{
					this.log("WARNING: samples not using delta packing (compression type = 0x00) are unsupported yet - skipping this sample.");
					continue;
				}
				
				old = 0;
				sample = [];
				for (l=0; l<instrument.samples[0].length; l++)
				{
					old += instrument.samples[0].data[l];
					sample[l] = old;
				}
				samples[k++] = sample;
				*/
			}
		}
		this.log("Instrument remap table ready, " + new_instrument_id + " unique instruments found.");
		
		this.log("Creating the song-pattern-channel-column dictionary and map...");
		for (i in this.xm_structures)
		{
			// read all the patterns into the merged_pattern_table
			pattern_column_map[i] = [];
			for (j in this.xm_structures[i].patterns)
			{
				pattern_column_map[i][j] = [];
				pattern = this.xm_structures[i].patterns[j];
				channels = this.xm_structures[i].header.number_of_channels;
				
				for (n=0; n<channels; n++)
				{
					pattern_column_map[i][j][n] = [];
					for (k=0; k<5; k++)
					{
						pattern_column = [];
						if (k != 1) // if this is not an instrument column...
						{
							for (l=n; l<pattern.number_of_rows * channels; l += channels)
							{
								pattern_column.push(pattern.data_unpacked[l][k]);
							}
						}
						else
						{
							for (l=n; l<pattern.number_of_rows * channels; l += channels)
							{
								b = pattern.data_unpacked[l][k];
								b = instrument_remap_table[i][b];
								pattern_column.push(b);
							}
						}
						index = this.dictionary.addArray(pattern_column);
						
						this.log("    song #" + i + ", pattern #" + j + ", channel #" + n + ", column #" + k + " stored as #" + index);
						
						pattern_column_map[i][j][n][k] = index;
						
						a++;
					}
				}
			}
		}
		this.log("Song-pattern-channel-column dictionary and map created.");
		
		// -- some stats
		this.log("  total columns: " + a + ", unique: " + this.dictionary.getContentCount());
		
		var old_size = 0, unpacked_size = 0, new_size = 0;
		
		for (i in this.xm_structures)
		{
			for (j in this.xm_structures[i].patterns)
			{
				old_size += this.xm_structures[i].patterns[j].packed_pattern_data_size;
				unpacked_size += this.xm_structures[i].patterns[j].number_of_rows * this.xm_structures[i].header.number_of_channels * 5;
			}
		}
		
		new_size += this.dictionary.getSize();
		
		for (i in pattern_column_map)
		{
			for (j in pattern_column_map[i])
			{
				for (n in pattern_column_map[i][j])
				{
					for (k in pattern_column_map[i][j][n])
					{
						new_size += 2; // index in map
					}
				}
			}
		}
		
		this.log("  old packed size: " + old_size + ", unpacked size: " + unpacked_size +", approx. new size: " + new_size);
		// -- end of stats
		
		/*
		  file format:
		  bytes    type  content
		      1   uint8  number of songs
		                 -- first song --
		      1   uint8  default bpm
		      1   uint8  default speed
		      1   uint8  number of patterns
		      1   uint8  number of channels
		      1   uint8  number of instruments
		      1   uint8  song length (in patterns)
		                 -- pattern order table --
		      1   uint8  first pattern id
		      1   uint8  second pattern id
		      1   uint8  "song length"th pattern id
		                 -- instrument table --
		      1   uint8  first instrument sample id
		      1   uint8  first instrument volume
		      1   uint8  first instrument pan
		      1   uint8  first instrument relative note number
		      1   uint8  second instrument sample id ...
		                 ... "number of instruments"th instrument
		                 -- first pattern --
		      1   uint8  number of rows
		      2  uint16  first channel notes index in dictionary
		      2  uint16  first channel instruments index in dictionary
		      2  uint16  first channel effect types index in dictionary
		      2  uint16  first channel effect parameters index in dictionary
		      2  uint16  second channel notes...
		                 ... "number of channels"th notes...
		                 -- second pattern --
		                 ...
		                 -- "number of patterns"th pattern --
		                 ...
		                 -- second song --
		                 ...
		                 -- "number of songs"th song --
		                 ...
		                 end
		*/
		
		buffer = new ArbitaryArray(null, 256);
		buffer.add(this.xm_structures.length);
		for (i in this.xm_structures)
		{
			buffer.add(this.xm_structures[i].header.default_bpm);
			buffer.add(this.xm_structures[i].header.default_tempo);
			buffer.add(this.xm_structures[i].header.number_of_patterns);
			buffer.add(this.xm_structures[i].header.number_of_channels);
			// buffer.add(this.xm_structures[i].header.number_of_instruments);
			buffer.add(new_instrument_id);
			buffer.add(this.xm_structures[i].header.song_length);
			
			for (j=0; j<this.xm_structures[i].header.song_length; j++)
			{
				buffer.add(this.xm_structures[i].header.pattern_order_table[j]);
			}
			
			for (j in pattern_column_map[i])
			{
				for (n in pattern_column_map[i][j])
				{
					buffer.add(this.xm_structures[i].patterns[j].number_of_rows);
					for (k in pattern_column_map[i][j][n])
					{
						buffer.add(pattern_column_map[i][j][n][k] & 0xFF);
						buffer.add(pattern_column_map[i][j][n][k] >> 16);
					}
				}
			}
		}
		
		this.generated_data = buffer.getAsUint8Array();
		this.instrument_titles = instrument_titles;
		
		return true;
	}
	
	this.getGeneratedData = function()
	{
		return {
			instrument_titles: this.instrument_titles,
			data_base64: base64_encode(new Uint8Array(this.generated_data)),
			dictionary_base64: base64_encode(this.dictionary.getContents())
		};
	}
}
