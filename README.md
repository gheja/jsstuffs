jsstuffs
========

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=master)](https://travis-ci.org/gheja/jsstuffs)

The build status icon above indicates whether the code is working as
expected. The build script makes extensive and strict testing against
all the libraries and classes to make sure that no commit makes renders
(some parts or the whole) repository unusable. See the latest results [here](https://travis-ci.org/gheja/jsstuffs).

For the tests I use [Mocha](http://visionmedia.github.io/mocha/) (as a
[Node.js](http://nodejs.org/) package), executed by [Travis CI](https://travis-ci.org/)
after ***every commit***. (These are really cool tools, you should check
them out if you haven't done already!)

Note: the project is not in node.js/npm package compatible format
(yet?), only the minimal package.json config is set up to run mocha
(i.e. has no meaningful "main" and "version" parameters).

[![Build Status](https://travis-ci.org/gheja/jsstuffs.png?branch=stable)](https://travis-ci.org/gheja/jsstuffs)
