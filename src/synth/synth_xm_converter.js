SynthXmConverter = function()
{
	this.xm_structures = [];
	
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
						for (l=n; l<pattern.number_of_rows; l += channels)
						{
							pattern_column.push(pattern.data_unpacked[l][k]);
						}
						
						index = pattern_column_dictionary.length;
						
						// check if we already stored an equivalent column array
						for (l=0; l<pattern_column_dictionary.length; l++)
						{
							if (pattern_column_dictionary[l].length == pattern_column.length)
							{
								found = 1;
								for (m=0; m<pattern_column.length; m++)
								{
									if (pattern_column_dictionary[l][m] != pattern_column[m])
									{
										found = 0;
										break;
									}
								}
								if (found)
								{
									index = l;
									break;
								}
							}
						}
						
						if (!found)
						{
							pattern_column_dictionary[index] = pattern_column;
							this.log("    song #" + i + ", pattern #" + j + ", channel #" + n + ", column #" + k + " stored as #" + index);
						}
						else
						{
							this.log("    song #" + i + ", pattern #" + j + ", channel #" + n + ", column #" + k + " stored as #" + index + " (already stored)");
						}
						
						pattern_column_map[i][j][n][k] = index;
						
						a++;
					}
				}
			}
		}
		this.log("Pattern column dictionary and map created.");
		
		this.log("total pattern-channel columns: " + a + ", unique: " + pattern_column_dictionary.length);
		
		return true;
	}
}
