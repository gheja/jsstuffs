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
		
		block = this.building_blocks[j];
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
	
	this.getBlocks = function()
	{
		return this.blocks;
	}
	
	this.setBlockProperty = function(block_index, property_name, property_value)
	{
		this.blocks[block_index][property_name] = property_value;
	}
}
