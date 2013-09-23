Dictionary = function()
{
	this.contents = [];
	
	this.addArray = function(a)
	{
		var i, j, index, found = 0;
		
		for (i=0; i<this.contents.length; i++)
		{
			if (this.contents[i].length == a.length)
			{
				found = 1;
				for (j=0; j<a.length; j++)
				{
					if (this.contents[i][j] != a[j])
					{
						found = 0;
						break;
					}
				}
				if (found)
				{
					index = j;
					break;
				}
			}
		}
		
		if (!found)
		{
			index = this.contents.length;
			this.contents[index] = a;
		}
		
		return index;
	}
	
	this.getArray = function(i)
	{
		return this.contents[i];
	}
	
	this.getContentCount = function()
	{
		return this.contents.length;
	}
	
	this.getContents = function()
	{
		var i, pos, buffer;
		
		pos = 0;
		
		for (i=0; i<this.contents.length; i++)
		{
			pos += this.contents[i].length + 2;
		}
		
		buffer = new Uint8Array(pos);
		
		pos = 0;
		for (i=0; i<this.contents.length; i++)
		{
			buffer[pos++] = this.contents[i].length & 0x00FF;
			buffer[pos++] = this.contents[i].length >> 16;
			for (j=0; j<this.contents[i].length; j++)
			{
				buffer[pos++] = this.contents[i][j];
			}
		}
		
		return buffer;
	}
	
	this.setContents = function(buffer)
	{
		var i, j, length, pos;
		
		pos = 0;
		i=0;
		
		while (pos<buffer.length)
		{
			length = buffer[pos++] + buffer[pos++] * 256;
			for (j=0; j<length; j++)
			{
				this.contents[i][j] = buffer[pos++];
			}
			i++;
		}
	}
	
	this.getSize = function()
	{
		return this.getContents().length;
	}
}
