/**
  * Synchronized Event Queue
  *
  * This event queue is intended to be used in a multiplayer environment where
  * the synchronous execution of events from all player is crucial (i.e. in a
  * realtime strategy game).
  *
  * The queue has "sources" - these are the players. The sources put events into
  * the queue and simultaneously read them. The events are groupped in "blocks".
  * When a source finishes a block it sends it through the network to the
  * other sources with an incremental block id. All the blocks represent
  * a specified time slice. All the sources wait until they receive the blocks
  * for a specified time and then process them, the trick is that there are two
  * so-called pointers, one for the write ("current_write_block_id") and one for
  & the read operation ("current_read_block_id"). The read pointer is always
  * behind the write pointer so there is a slight delay (hey, this is a queue!)
  * between putting the item in the queue and getting it out. This delay is used
  * to transmit the block over the network.
  *
  * So basically a write is happening when an action is made (i.e. sent a unit
  * to a position) and the read happens when the action has its effects (i.e.
  * the unit starts to move).
  *
  * This kind of queue is being used in numerous of famous (if not legendary)
  * RTS games and game series, i.e. Age of Empires, Warcraft, Starcraft. There
  * are also methods to hide the delay in the game introduced by the queue, most
  * common is probably the acknowledgement by playing a sound or some animation.
  */

/** @constructor */
SynchronizedEventQueue = (function(total_source_count, this_source_id)
{
	/** @private */ this.source_id = 0;
	/** @private */ this.current_write_block_id = 0;
	/** @private */ this.current_write_tick = 0;
	/** @private */ this.current_read_block_id = 0;
	/** @private */ this.current_read_tick = 0;
	/** @private */ this.last_complete_block_id = 0;
	/** @private */ this.write_read_block_distance = 2;
	/** @private */ this.ticks_per_block = 10;
	/** @private */ this.buffer = []; // the block currently being written by this source
	/** @private */ this.read_waiting = 0;
	/** @private */ this.write_waiting = 0;
	/** @private */ this.sources = [];
	
	/**
	  * Add an event in the current block at the current tick. The event is an
	  * arbitary value, it can be a number, string, Array or anything as long as
	  * it can be sent over the network.
	  *
	  * Note: any number of events can be stored on a tick.
	  *
	  * @public
	  * @param {*} event the event to be stored, sent and then processed
	  */
	this.addEvent = function(event)
	{
		if (this.write_waiting)
		{
			return false;
		}
		
		this.buffer[this.buffer.length] = [this.current_write_tick, event];
	}
	
	/**
	  * Stores a block in the queue for the given source (indicated in the block).
	  *
	  * @private
	  * @param {Object} block the block to be stored
	  */
	this.storeBlock = function(block)
	{
		this.sources[block.source_id].blocks[block.block_id] = block;
		this.sources[block.source_id].last_block_id = block.block_id;
		
		this.updateLastCompleteBlockId();
		this.updateWaitStatus();
	}
	
	/**
	  * Store a dummy block - when initializing a queue there must be some
	  * distance between the write and read pointers. This method creates just
	  * enough empty blocks to make the queue valid.
	  *
	  * @private
	  * @param {number} source_id the id of the source
	  * @param {number} id the block id
	  */
	this.storeDummyBlock = function(source_id, id)
	{
		var block = { source_id: source_id, ticks: this.ticks_per_block, block_id: id, block_data: [] }
		this.storeBlock(block);
	}
	
	/**
	  * Send a block to the server via the callback function registered on
	  * construction of the instance.
	  *
	  * @private
	  * @param {Object} block the block to be sent
	  */
	this.sendBlockToServer = function(block)
	{
		// TODO: this needs to be a callback
		_dummy_network.send(block, this.source_id);
	}
	
	/**
	  * Callback function to receive a block from the server sent by another
	  * source.
	  *
	  * @public
	  * @param {Object} block the received block
	  */
	this.receiveBlockFromServer = function(block)
	{
		this.storeBlock(block);
	}
	
	/**
	  * Finalize the current block on this source and send it over the network.
	  *
	  * @private
	  */
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
	
	/**
	  * Loop through the received blocks and find the index of the last complete
	  * block.
	  *
	  * A block is only complete when all the sources have sent and we have
	  * received them.
	  *
	  * @private
	  */
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
	
	/**
	  * Get the events for the current tick from all the sources.
	  *
	  * @private
	  * @returns {Array}
	  */
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
	
	/**
	  * See if we need to wait for the other sources and update the flags
	  * accordingly.
	  *
	  * @private
	  */
	this.updateWaitStatus = function()
	{
		this.write_waiting = (this.current_write_block_id > this.current_read_block_id + 2);
		this.read_waiting = (this.last_complete_block_id < this.current_read_block_id);
	}
	
	/**
	  * Try to read the events for the next tick. If the read is blocked (i.e.
	  * we are waiting for some other sources) {false} is returned.
	  *
	  * @public
	  * @returns {Array|boolean}
	  */
	this.readTick = function()
	{
		if (this.read_waiting)
		{
			return false;
		}
		
		var events = this.getEventsForThisTick();
		
		this.current_read_tick++;
		
		if (this.current_read_tick == this.ticks_per_block)
		{
			this.current_read_block_id++;
			this.current_read_tick = 0;
			this.updateWaitStatus();
		}
		
		return events;
	}
	
	/**
	  * Try to proceed to the next tick in the write block. If the block is full
	  * then the index of the currently written block is increased and the full
	  * block will be sent.
	  *
	  * If the write is blocked (i.e. we are waiting for some other sources or
	  * we cannot store another write) {false} is returned, otherwise {true}.
	  *
	  * @public
	  * @return {boolean}
	  */
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
	
	
	
	// initialization
	/** @private */ var i;
	/** @private */ var j;
	
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

/* TODO: add exports for Closure Compiler */
