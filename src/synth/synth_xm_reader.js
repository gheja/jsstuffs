SynthXmReader = function()
{
	this.header = {};
	this.patterns = [];
	
	this.log = function(s)
	{
		console.log("SynthXmReader: " + s);
	}
	
	this.readFile = function(data)
	{
		var dv = new jDataView(data);
		
		this.log("Attempting to load file...")
		
		// the little/bigendian conversion was not working (why?)
		dv.getUint16_2 = function()
		{
			return this.getUint8() + this.getUint8() * 256;
		}
		dv.getUint32_2 = function()
		{
			return this.getUint8() + this.getUint8() * 256 + this.getUint8() * 256*256 + this.getUint8() * 256*256*256;
		}
		
		if (dv.getString(17) != "Extended Module: ")
		{
			this.log("\"Extended Module: \" header not found.");
			return false;
		}
		this.log("File seems to be valid, reading the rest of the header...");
		
		this.header = {
			song_name: dv.getString(20),
			x1a: dv.getUint8(),
			tracker_name: dv.getString(20),
			version_number: dv.getUint16_2(),
			header_size: dv.getUint32_2(),
			song_length: dv.getUint16_2(),
			restart_position: dv.getUint16_2(),
			number_of_channels: dv.getUint16_2(),
			number_of_patterns: dv.getUint16_2(),
			number_of_instruments: dv.getUint16_2(),
			flags: dv.getUint16_2(),
			default_tempo: dv.getUint16_2(), // = speed
			default_bpm: dv.getUint16_2(),
			pattern_order_table: dv.getBytes(256)
		};
		
		if (this.header.x1a != 0x1A)
		{
			this.log("Failed to read header: 0x1A not found.");
			return false;
		}
		
		this.log("Header succesfully read, seeking to first pattern header...");
		
		dv.seek(60 + this.header.header_size);
		
		for (i=0; i<this.header.number_of_patterns; i++)
		{
			this.log("Reading pattern #" + i + " header...");
			var pattern = {
				header_size: dv.getUint32_2(),
				packing_type: dv.getUint8(), // dummy
				number_of_rows: dv.getUint16_2(),
				packed_pattern_data_size: dv.getUint16_2()
			};
			
			if (pattern.header_size != 9)
			{
				this.log("WARNING: Pattern header is " + pattern.header_size + " bytes long. This is probably bad, continuing anyway...");
			}
			
			if (pattern.packed_pattern_data_size == 0)
			{
				this.log("Pattern is empty, not reading data...");
				// channels = 4
				pattern.data = new Uint8Array(4 * pattern.header.number_of_rows);
			}
			else
			{
				this.log("Reading pattern #" + i + " data...");
				pattern.data = dv.getBytes(pattern.packed_pattern_data_size);
			}
			
			this.patterns[i] = pattern;
		}
		this.log("End of patterns.");
		
		this.log("File was successfully read.");
		
		return true;
	}
}
