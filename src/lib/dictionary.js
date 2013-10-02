/** @constructor */
var Dictionary = function()
{
	"use strict";
	
	this.contents = [];
	
	this.addArray = function(a)
	{
		var i, j, index, found = 0;
		
		if (a.length === 0)
		{
			throw "Cannot store an empty array.";
		}
		if (a.length > 256)
		{
			throw "Array must have <= 256 elements.";
		}
		
		for (i=0; i<this.contents.length; i++)
		{
			if (this.contents[i].length === a.length)
			{
				found = 1;
				for (j=0; j<a.length; j++)
				{
					if (this.contents[i][j] !== a[j])
					{
						found = 0;
						break;
					}
				}
				if (found)
				{
					index = i;
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
	};
	
	this.getArray = function(i)
	{
		return this.contents[i];
	};
	
	this.getContentCount = function()
	{
		return this.contents.length;
	};
	
	this.getContents = function()
	{
		var i, j, pos, buffer;
		
		pos = 0;
		
		for (i=0; i<this.contents.length; i++)
		{
			pos += this.contents[i].length + 1;
		}
		
		buffer = new Uint8Array(pos);
		
		pos = 0;
		for (i=0; i<this.contents.length; i++)
		{
			buffer[pos++] = this.contents[i].length & 0xFF;
			for (j=0; j<this.contents[i].length; j++)
			{
				buffer[pos++] = this.contents[i][j];
			}
		}
		
		return buffer;
	};
	
	this.setContents = function(buffer)
	{
		var i, j, length, pos;
		
		pos = 0;
		i=0;
		
		while (pos<buffer.length)
		{
			length = buffer[pos++];
			if (length === 0)
			{
				length = 256;
			}
			
			this.contents[i] = [];
			for (j=0; j<length; j++)
			{
				this.contents[i][j] = buffer[pos++];
			}
			i++;
		}
	};
	
	this.getSize = function()
	{
		return this.getContents().length;
	};
};
