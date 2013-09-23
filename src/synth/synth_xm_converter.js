SynthXmConverter = function()
{
	this.xm_structures = [];
	this.dictionary = new Dictionary();
	this.generated_data = null;
	
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
			pattern,
			a = 0;
		
		this.log("Processing " + this.xm_structures.length + " songs...");
		
		// TODO: create new instruments for multi-sample instruments here
		
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
						for (l=n; l<pattern.number_of_rows * channels; l += channels)
						{
							pattern_column.push(pattern.data_unpacked[l][k]);
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
		
		buffer = [];
		pos = 0;
		
		/*
		  file format:
		  bytes   type  content
		      1  uint8  number of songs
		                -- first song --
		      1  uint8  default bpm
		      1  uint8  default speed
		      1  uint8  number of patterns
		      1  uint8  number of channels
		      1  uint8  number of instruments
		      1  uint8  song length (in patterns)
		                -- pattern order table --
		      1  uint8  first pattern id
		                second pattern id
		                "song length"th pattern id
		                -- first pattern --
		      1  uint8  first channel notes index in dictionary
		      1  uint8  first channel instruments index in dictionary
		      1  uint8  first channel effect types index in dictionary
		      1  uint8  first channel effect parameters index in dictionary
		      1  uint8  second channel notes...
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
		
		buffer[pos++] = this.xm_structures.length;
		for (i in this.xm_structures)
		{
			buffer[pos++] = this.xm_structures[i].header.default_bpm;
			buffer[pos++] = this.xm_structures[i].header.default_tempo;
			buffer[pos++] = this.xm_structures[i].header.number_of_patterns;
			buffer[pos++] = this.xm_structures[i].header.number_of_channels;
			buffer[pos++] = this.xm_structures[i].header.number_of_instruments;
			buffer[pos++] = this.xm_structures[i].header.song_length;
			
			for (j=0; j<this.xm_structures[i].header.song_length; j++)
			{
				buffer[pos++] = this.xm_structures[i].header.pattern_order_table[j];
			}
			
			for (j in pattern_column_map[i])
			{
				for (n in pattern_column_map[i][j])
				{
					buffer[pos++] = this.xm_structures[i].patterns[j].number_of_rows;
					for (k in pattern_column_map[i][j][n])
					{
						buffer[pos++] = pattern_column_map[i][j][n][k] & 0xFF;
						buffer[pos++] = pattern_column_map[i][j][n][k] >> 16;
					}
				}
			}
		}
		
		this.generated_data = buffer;
		
		return true;
	}
	
	this.getGeneratedData = function()
	{
		return base64_encode(new Uint8Array(this.generated_data)) + "\n\n" + base64_encode(this.dictionary.getContents());
	}
}
