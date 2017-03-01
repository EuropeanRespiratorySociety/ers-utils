'use strict';

const assert = require('chai').assert;
const format = require('../../').Format;


describe('Format Util', function() {
  it('formats the title of the item object', () => {
    const item = {title: 'Title to test | this should be removed'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  it('it does nothing to the title', () => {
    const item = {title: 'Title to test'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  // it('it converts markdown to html', () => {
  //   const mkd = require('marked');
  //   mkd.setOptions({
  //     renderer: new mkd.Renderer(),
  //     gfm: true,
  //     tables: true,
  //     breaks: false,
  //     pedantic: false,
  //     sanitize: false,
  //     smartLists: true,
  //     smartypants: false
  //   });

  //   const toParse = ['body'];
  //   const childrenToParse = ['object', 'arrayOfObjects']
  //   const item = {
  //     body: "### This is a tiltle\n",
  //     object: { info: "For venue and suggested accomodation please refer to the pratical info document." },
  //     arrayOfObjects: [
  //         { info: "For venue and suggested accomodation please refer to the pratical info document." },
  //         { text: "For venue and suggested accomodation please refer to the pratical info document." }
  //       ]
  //     };
  //   assert.equal(format.title(item).title, 'Title to test');
  // });
});