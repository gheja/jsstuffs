# synth

"Synth" is more or less an XM player, supporting multiple songs with shared samples, instruments and patterns.

The Synth is aimimg at simplicity and small size both for player and data.

The Synth.render() loads the samples, instruments, patterns and songs, and then renders all the songs to separate HTML audio objects. Synth.play() can play the generated objects.

## Samples

No pre-generated samples are stored (i.e. WAV files) but they are stored as "recipes". These recpies tell the SynthSampleGenerator how to create the final samples.

## Instruments

Intstruments are instruments can be found in XMs.

## Patterns

Patterns are stored compressed based on ...

## Compression

...
