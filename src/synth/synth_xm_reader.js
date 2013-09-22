SynthXmReader = function()
{
	this.header = {};
	
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
		
		this.log("Header succesfully read.");
		
		return true;
	}
}
