jsstuffs
========

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=master)](https://travis-ci.org/gheja/jsstuffs)

This is a library for javascript game projects, intending to be
minimalistic and size-optimized.

See the [src/](src/) directory for the modules.


The modules
===========

src/event_queue/*
-----------------

**SynchronizedEventQueue** is intended to be used in a multiplayer
environment where the synchronous execution of events from all player is
crucial (i.e. in a realtime strategy game).

The queue has "sources" - these are the players. The sources put events
into the queue and simultaneously read them. The events are groupped in
"blocks". When a source finishes a block it sends it through the network
to the other sources with an incremental block id. All the blocks
represent a specified time slice. All the sources wait until they
receive the blocks for a specified time and then process them, the trick
is that there are two so-called pointers, one for the write
("current_write_block_id") and one for the read operation
("current_read_block_id"). The read pointer is always behind the write
pointer so there is a slight delay (hey, this is a queue!) between
putting the item in the queue and getting it out. This delay is used to
transmit the block over the network.

So basically a write is happening when an action is made (i.e. sent a
unit to a position) and the read happens when the action has its effects
(i.e. the unit starts to move).


src/synth/*
-----------

**Synth** is a pattern-channel-instrument-sample based tracker
supporting multiple "songs". It builds the songs from given "sample
recipes" (rendered to a sample by **SynthSampleGenerator**), "file"
(storing the settings of instruments, advanced sample properties,
indexes columns (note, instrument index, effect, effect parameter) for
the channels) and a "dictionary" (containing the actual data for the
columns in the channels).

The **SynthSampleGenerator** that generates the samples from "recipes"
rather than storing them - these "song recipes" can then be used in
Synth.

The **SynthXmReader** class is a file loader for files in the
[.xm file format](https://en.wikipedia.org/wiki/XM_%28file_format%29).

**SynthXmConverter** handles the loaded .xm files (multiple can be
loaded in one convert). First it does some optimizations: de-duplicates
the samples, instruments and channel columns for each pattern, then
generates a "dictionary" object with the column data and the indexes
need to be used for the decompression. Secondly it creates the
structures accepted by the **Synth**.


src/lib/almost_random.js
------------------------

**AlmostRandom** is a simple pseudorandom number generator, giving the
same sequence of "random" values for the same seed every time.


src/lib/array.js
----------------

**ArbitaryArray** is a seekable array handler with the function of
adding and returning items, also with the support of two items and the
second multiplied by a given multiplier.

It is useful to read through a file byte-by-byte and occasionally by word.

src/lib/base64.js
-----------------

Simple base64 encoding and decoding functions.


src/lib/dictionary.js
---------------------

**Dictionary** stores one dimensional arrays and returns an index for
them. If a request appears for storing the same array it returns the
index of the first occurence and does not store the given array again.
This way it can be used as a basic compression method.


src/lib/misc.js
---------------

Miscellaneous helpers for performing basic tasks.

It has **clamp_and_round_*()** functions to make an arbitary value fit
into a specified type (int6, uint6, int8, uint8, int12, uint12, int16,
uint16, int24, uint24, int32, uint32).

It also has a **deep_copy_object()** helper that makes a copy of a given
array/object recursively -- note: this is not a perfect cloning
solution!

The **plural_or_not()** helps to append the proper form of unit ("1
thing", "2 things").


Notes
=====

The project is not in node.js/npm package compatible format (yet?) (i.e.
it has no meaningful "main" and "version" parameters so don't attempt to
take them seriously), only the minimal package.json config is set up to
run the unit test by node.js and mocha.

**Master branch**: [![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=master)](https://travis-ci.org/gheja/jsstuffs)

**Latest commit**: [![Build Status](https://travis-ci.org/gheja/jsstuffs.png)](https://travis-ci.org/gheja/jsstuffs)
