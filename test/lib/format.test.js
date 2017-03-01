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

  it('it converts markdown to html', () => {
    const toParse = ['body'];
    const childrenToParse = ['object', 'arrayOfObjects']
    const item = {
      body: "### This is a title\n",
      object: { info: "test string" },
      arrayOfObjects: [
          { info: "test string" },
          { text: "test string" }
        ]
      };
    let parsed = format.markDownToHtml(item, toParse, childrenToParse)
    assert.equal(parsed.body, '<h3>This is a title</h3>');
    assert.equal(parsed.object.info, '<p>test string</p>');
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>');
  });
});