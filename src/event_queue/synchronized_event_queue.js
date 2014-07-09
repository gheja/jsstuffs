/**
  * Synchronized Event Queue
  */

/** @constructor */
SynchronizedEventQueue = (function(total_source_count, this_source_id)
{
	this.source_id = 0;
	this.current_write_block_id = 0;
	this.current_write_tick = 0;
	this.current_read_block_id = 0;
	this.current_read_tick = 0;
	this.last_complete_block_id = 0;
	this.write_read_block_distance = 2;
	this.ticks_per_block = 10;
	this.ticks_per_read_block = 10;
	this.buffer = []; // the block currently being written by this source
	this.read_waiting = 0;
	this.write_waiting = 0;
	this.sources = [];
	
	
	this.addEvent = function(event)
	{
		if (this.write_waiting)
		{
			return false;
		}
		
		this.buffer[this.buffer.length] = [this.current_write_tick, event];
	}
	
	this.storeBlock = function(block)
	{
		this.sources[block.source_id].blocks[block.block_id] = block;
		this.sources[block.source_id].last_block_id = block.block_id;
		
		this.updateLastCompleteBlockId();
		this.updateWaitStatus();
	}
	
	this.storeDummyBlock = function(source_id, id)
	{
		var block = { source_id: source_id, ticks: this.ticks_per_block, block_id: id, block_data: [] }
		this.storeBlock(block);
	}
	
	this.sendBlockToServer = function(block)
	{
		_dummy_network.send(block, this.source_id);
	}
	
	this.sendCurrentBlock = function()
	{
		var block = {
			source_id: this.source_id,
			ticks: this.current_write_tick,
			block_id: this.current_write_block_id,
			block_data: this.buffer
		};
		
		this.current_write_tick = 0;
		this.current_write_block_id++;
		this.buffer = [];
		
		this.storeBlock(block);
		this.sendBlockToServer(block);
	}
	
	this.updateLastCompleteBlockId = function()
	{
		var i, j, k;
		
		k = -1;
		
		for (i=0; i<this.sources.length; i++)
		{
			if (this.sources[i].last_block_id < k || k == -1)
			{
				k = this.sources[i].last_block_id;
			}
		}
		
		this.last_complete_block_id = k;
	}
	
	this.getEventsForThisTick = function()
	{
		var i, a, events;
		
		events = [];
		
		for (i=0; i<this.sources.length; i++)
		{
			for (j=0; j<this.sources[i].blocks[this.current_read_block_id].block_data.length; j++)
			{
				a = this.sources[i].blocks[this.current_read_block_id].block_data[j];
				if (a[0] == this.current_read_tick)
				{
					events[events.length] = a[1];
				}
			}
		}
		
		return events;
	}
	
	this.updateWaitStatus = function()
	{
		this.write_waiting = (this.current_write_block_id > this.current_read_block_id + 2);
		this.read_waiting = (this.last_complete_block_id < this.current_read_block_id);
	}
	
	this.readTick = function()
	{
		if (this.read_waiting)
		{
			return false;
		}
		
		var events = this.getEventsForThisTick();
		
		this.current_read_tick++;
		
		if (this.current_read_tick == this.ticks_per_read_block)
		{
			this.current_read_block_id++;
			this.current_read_tick = 0;
			this.updateWaitStatus();
		}
		
		return events;
	}
	
	this.writeTick = function()
	{
		if (this.write_waiting)
		{
			return false;
		}
		
		this.current_write_tick++;
		
		if (this.current_write_tick == this.ticks_per_block)
		{
			this.sendCurrentBlock();
		}
		
		return true;
	}
	
	// this receives the packet
	this.receiveBlockFromServer = function(block)
	{
		this.storeBlock(block);
	}
	
	
	
	// initialization
	var i, j;
	
	for (i=0; i<total_source_count; i++)
	{
		this.sources[i] = { blocks: [], last_block_id: 0 };
		
		// initial dummy blocks (pretend we received them)
		for (j=0; j<this.write_read_block_distance; j++)
		{
			this.storeDummyBlock(i, j);
		}
	}
	this.source_id = this_source_id;
	this.current_read_block_id = 0;
	this.current_write_block_id = this.write_read_block_distance;
});

