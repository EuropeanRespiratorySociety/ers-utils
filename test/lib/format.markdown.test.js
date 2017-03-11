'use strict';

const assert = require('chai').assert;
const format = require('../../').Format;

describe('Format Util (Markdown parsing)', () => {
  const item = {
    body: "### This is a title\n",
    bodyFalse: false,
    object: { info: "test string",
              text: "test string",
              foreign: "should not be parsed" },
    objectWithNoValueOfInterest: {
      something: 'string for fun'
    },          
    emptyObject: {},          
    emptyArray: [], 
    false: false,         
    arrayOfObjects: [
        { info: "test string" },
        { text: "test string" },
        { info: "test string" },
        { foreign: "should not be parsed" }
      ],
      should: "not be touched either",
      not: () => undefined 
  };

  it('converts markdown to html', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = ['object','objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.markDownToHtml(item, toParse, childrenToParse);

    assert.equal(parsed.body, '<h3>This is a title</h3>\n');
    assert.equal(parsed.object.info, '<p>test string</p>\n');
    assert.equal(parsed.object.text, '<p>test string</p>\n');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[2].info, '<p>test string</p>\n');
  });

  it('parses only main properties (test without optional param)', () =>{
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    let parsed = format.markDownToHtml(item, toParse);
    assert.equal(assert.equal(parsed.body, '<h3>This is a title</h3>\n'));
    assert.equal(parsed.arrayOfObjects[0].info, "test string");
    assert.equal(parsed.arrayOfObjects[1].text, "test string");
    assert.equal(parsed.arrayOfObjects[2].info, "test string");
  })

  it('does not parse', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = ['object','objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.markDownToHtml(item, toParse, childrenToParse)

    assert.equal(parsed.object.foreign, 'should not be parsed');
    assert.equal(parsed.objectWithNoValueOfInterest.something, 'string for fun');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[3].foreign, 'should not be parsed');
    assert.equal(parsed.should, 'not be touched either');
  });
});