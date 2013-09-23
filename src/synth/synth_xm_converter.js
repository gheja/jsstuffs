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
		var i, j, a, merged_pattern_table;
		
		this.log("Processing " + this.xm_structures.length + " songs...");
		
		merged_pattern_table = [];
		k = 0;
		this.log("Assembling the merged pattern table...");
		for (i in this.xm_structures)
		{
			this.log("  start index of song #" + i + " in the merged pattern table is " + k);
			
			// read all the patterns into the merged_pattern_table
			for (j=0; j<this.xm_structures[i].header.song_length; j++)
			{
				a = this.xm_structures[i].header.pattern_order_table[j];
				this.log("    song #" + i + ", pattern order #" + j + " is pattern #" + a + " of song, copying it to the merged pattern table as #" + k);
				
				merged_pattern_table[k] = this.xm_structures[i].patterns[a].data_unpacked;
				k++;
			}
		}
		this.log("Merged pattern table assembled.");
		
		return true;
	}
}
