SynthXmConverter = function()
{
	this.xm_structures = [];
	this.dictionary = new Dictionary();
	
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
		
		this.log("Creating the pattern-channel column dictionary and map...");
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
		this.log("Pattern column dictionary and map created.");
		
		this.log("total pattern-channel columns: " + a + ", unique: " + this.dictionary.getContentCount());
		
		return true;
	}
}
