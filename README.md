# ERS Utils

[![Build Status](https://travis-ci.org/EuropeanRespiratorySociety/ers-utils.svg?branch=master)](https://travis-ci.org/EuropeanRespiratorySociety/ers-utils)

[![Coverage Status](https://coveralls.io/repos/github/EuropeanRespiratorySociety/ers-utils/badge.svg?branch=master)](https://coveralls.io/github/EuropeanRespiratorySociety/ers-utils?branch=master)

The aime of this library is to help parsing the data coming from Cloud CMS.

* It parses dates according to the ERS corporate guidelines
* It pasrses markdown to html
* Formats the calendar
* Generates url for documents and images
* ...

The composition module helps reducing the amount of maping necessary to parse items as an item is mapped once and the passed to each of the methods. For this purposes there are some convinience methods that take an item/article as an input and outputs an updated items. The full object is passed from method to method.
This is not fully functional as it gets mutated at every setps.

### Install

`$ npm install --save ers-utils`

### Use

```
    const cp = require('ers-utils').Composition;
    const format = require('ers-utils').Format;
    const date = require('ers-utils').Date;
    const fp = require('ers-utils').Fp;
```

### Tests

Run test as follow:

`$ mocha test/lib -w`

### Collaborate 
I do not know who might need this, but if someone finds any interest some ERS logic could be abstracted further away...

