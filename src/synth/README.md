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

## Compression method (for multiple .XM files)

1. Load the .XM file (in order of appearance of the data)
  * Load the pattern order table
  * Load content of patterns
  * Load instrument namess and parameters
  * Load sample names and numbers
  * Ignore actual sample data

2. Create a map of instrument names and numbers, sample names and numbers
  * Remap numbers in patterns and instruments if necessary (i.e. common instrument/sample found by their name)

3. Assemble the patterns based on pattern order table
  * All rows are now in order from the first to the last

4. Append the generated pattern to the previous ones, make note of the starting id and length

5. Do the previous steps for all the remaining .XM files

6. Disassemble rows
  * Create a flat array of all the notes, instruments, volumes, effect ids, effect parameters
  * I.e. ```C-4 3 30 A08```, ```C-5 4 40 A07``` becomes ```C-4 C-5 3 4 30 40 A08 A07```

7. Create the compressed row data
  * Create a dictionary based on repeating "strings"
  * Create a map to reassemble the original rows

...