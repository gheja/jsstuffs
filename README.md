jsstuffs
========

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=master)](https://travis-ci.org/gheja/jsstuffs)

This is a library for javascript game projects intending to be
minimalistic and size-optimized.

See the src/ directory for the modules.


The modules
===========

src/synth/*
-----------

**Synth** is a pattern and channel based tracker supporting multiple
"songs", optimizing the contents by de-duplicating identical patterns
(on a column based approach), instruments and samples.

It also has a **SynthSampleGenerator** that generates the samples from
"recipes" rather than storing them.

The **Synth** can load XM songs via the **SynthXmReader** class and
convert them to its internal format using the **SynthXmConverter**
class.


Notes
=====

The project is not in node.js/npm package compatible format (yet? i.e.
it has no meaningful "main" and "version" parameters so don't attempt to
take them seriously), only the minimal package.json config is set up to
run the unit test by node.js and mocha.

Build status of the **master branch**:

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=master)](https://travis-ci.org/gheja/jsstuffs)

Build status of the **latest commit**:

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png)](https://travis-ci.org/gheja/jsstuffs)
