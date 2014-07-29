/**
  * @module packed_editor
  */

/**
  * Pakced Editor
  *
  * @constructor
  * @class PackedEditor
  */
PackedEditor = function(building_blocks)
{
	this.building_blocks = building_blocks;
	this.render_callback = null;
	this.highlight_callback = null;
	this.last_render_message = "";
	
	this.title = "Packed Editor";
	this.blocks = [];
	
	this.log = function(s)
	{
		console.log("PackedEditor (" + this.title + "): " + s);
	}
	
	this.getBuildingBlocks = function()
	{
		return this.building_blocks;
	}
	
	this.setTitle = function(new_title)
	{
		this.title = new_title;
	}
	
	this.getTitle = function()
	{
		return this.title;
	}
	
	this.addBlock = function(block_identifier, position)
	{
		var i, j, new_blocks, block;
		
		j = -1;
		for (i=0; i<this.building_blocks.length; i++)
		{
			if (this.building_blocks[i].block_identifier == block_identifier)
			{
				j = i;
				break;
			}
		}
		
		if (j == -1)
		{
			this.log("ERROR: could not find building_block with block_identifier " + block_identifier + " to insert it to position " + position);
			return;
		}
		
		new_blocks = [];
		
		for (i=0; i<position && i<this.blocks.length; i++)
		{
			new_blocks.push(this.blocks[i]);
		}
		
		block = deep_copy_object(this.building_blocks[j]);
		block.collapsed = 0;
		
		new_blocks.push(block);
		
		this.log("Added block with block_identifier " + block_identifier + " at position " + i);
		
		for (; i<this.blocks.length; i++)
		{
			new_blocks.push(this.blocks[i]);
		}
		
		this.blocks = new_blocks;
		
		return true;
	}
	
	this.removeBlock = function(position)
	{
		var i, new_blocks;
		
		new_blocks = [];
		
		for (i=0; i<this.blocks.length; i++)
		{
			if (i == position)
			{
				continue;
			}
			new_blocks.push(this.blocks[i]);
		}
		
		this.blocks = new_blocks;
		
		this.log("Removed block at position " + i);
		
		return true;
	}
	
	this.getParameterValue = function(block_id, parameter_id)
	{
		return this.blocks[block_id].parameters[parameter_id].value;
	}
	
	this.setParameterValue = function(block_id, parameter_id, new_value)
	{
		this.blocks[block_id].parameters[parameter_id].value = Math.min(this.blocks[block_id].parameters[parameter_id].max, Math.max(this.blocks[block_id].parameters[parameter_id].min, new_value));
	}
	
	this.getBlocks = function()
	{
		return this.blocks;
	}
	
	this.setBlockProperty = function(block_index, property_name, property_value)
	{
		this.blocks[block_index][property_name] = property_value;
	}
	
	this.render = function()
	{
		var i, j, p, buffer;
		
		buffer = new ArbitaryArray();
		
		for (i=0; i<this.blocks.length; i++)
		{
			buffer.add(this.blocks[i].block_identifier);
			
			for (j=0; j<this.blocks[i].parameters.length; j++)
			{
				p = this.blocks[i].parameters[j];
				if (p.max - p.min <= 255)
				{
					buffer.add(p.value);
				}
				else if (p.max - p.min <= 65535)
				{
					buffer.addTwo(p.value);
				}
				else
				{
					this.log("Value too big in block #" + i + ", parameter #" + j + ", aborting.");
					return null;
				}
			}
		}
		
		this.last_render_message = this.blocks.length + " blocks, " + (buffer.getAsUint8Array()).length + " bytes in total.";
		
		return buffer;
	}
	
	this.getLastRenderMessage = function()
	{
		return this.last_render_message;
	}
}
