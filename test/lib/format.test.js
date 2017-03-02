'use strict';

const assert = require('chai').assert;
const format = require('../../').Format;


describe('Format Util', function() {
  it('formats the title of the item object', () => {
    const item = {title: 'Title to test | this should be removed'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  it('does nothing to the title', () => {
    const item = {title: 'Title to test'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  it('converts markdown to html', () => {
    const toParse = ['body'];
    const childrenToParse = ['object', 'arrayOfObjects']
    const item = {
      body: "### This is a title\n",
      object: { info: "test string",
                text: "test string" },
      arrayOfObjects: [
          { info: "test string" },
          { text: "test string" },
          { info: "test string" }
        ]
      };
    let parsed = format.markDownToHtml(item, toParse, childrenToParse)
    console.log(parsed);
    assert.equal(parsed.body, '<h3>This is a title</h3>\n');
    assert.equal(parsed.object.info, '<p>test string</p>\n');
    assert.equal(parsed.object.text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[2].info, '<p>test string</p>\n');
  });


  it('maps the model with the received data', () => {
    const data = {title: 'Title to test'};
    const model = {title: false, body: false, any: false}
    const result = {title: 'Title to test', body: false, any: false}
    assert.deepEqual(format.mapModel(model,data), result);
  });

  it('truncates a string and appends ... after the default length (80)', () =>{
    const string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi.";//125 characters
    const truncated = format.truncate(string);
    assert.isAtMost(truncated.length, 80);
    assert.isTrue(truncated.includes('...'));
  });

  it('truncates a string and appends ... after the desired length', () =>{
    const string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi.";//125 characters
    assert.isAtMost(format.truncate(string, 50).length, 50);
  });

  it('truncates a string and appends a custom ommission', () => {
    const string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi.";//125 characters
    assert.isTrue(format.truncate(string, 50, '///').includes('///'));
  });

});