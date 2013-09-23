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
			pattern_column_dictionary = [],
			pattern_column_map = [],
			pattern,
			a = 0;
		
		this.log("Processing " + this.xm_structures.length + " songs...");
		
		this.log("Creating the pattern column dictionary and map...");
		for (i in this.xm_structures)
		{
			// read all the patterns into the merged_pattern_table
			for (j in this.xm_structures[i].patterns)
			{
				pattern_column_map[j] = [];
				pattern = this.xm_structures[i].patterns[j];
				
				for (k=0; k<5; k++)
				{
					pattern_column = [];
					for (l=0; l<pattern.number_of_rows; l++)
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
						this.log("    song #" + i + ", pattern #" + j + ", column #" + k + " stored as #" + index);
					}
					else
					{
						this.log("    song #" + i + ", pattern #" + j + ", column #" + k + " stored as #" + index + " (already stored)");
					}
					
					pattern_column_map[j][k] = index;
					
					a++;
				}
			}
		}
		this.log("Pattern column dictionary and map created.");
		
		this.log("total pattern columns: " + a + ", unique pattern columns: " + pattern_column_dictionary.length);
		
		return true;
	}
}
