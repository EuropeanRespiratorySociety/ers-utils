const assert = require('chai').assert;
const F = require('../../lib/library.min').Format;
const format = new F();
const composedBody = require('../mocks/composed-body');

describe('Format Util (Markdown parsing)', () => {
  const item = {
    body: '### This is a title\n',
    bodyFalse: false,
    object: { info: 'test string',
              text: 'test string',
              foreign: 'should not be parsed' },
    objectWithNoValueOfInterest: {
      something: 'string for fun'
    },          
    emptyObject: {},
    emptyArray: [],
    false: false,
    flags: [
      {
      text: false,
      color: false
      }
    ],
    arrayOfObjects: [
        { info: 'test string' },
        { text: 'test string' },
        { info: 'test string' },
        { foreign: 'should not be parsed' }
      ],
    arrayOfStrings: [
      'should not be parsed',
      'this either',
    ],  
    should: 'not be touched either',
    not: () => undefined
  };

  it('converts markdown to html', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = ['object','objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.parseContent(item, toParse, childrenToParse);

    assert.equal(parsed.body, '<h3>This is a title</h3>\n');
    assert.equal(parsed.object.info, '<p>test string</p>\n');
    assert.equal(parsed.object.text, '<p>test string</p>\n');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.deepEqual(parsed.flags, [{text: false, color: false}]);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[2].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('converts markdown to raw text', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = ['object','objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.parseContent(item, toParse, childrenToParse, true);

    assert.equal(parsed.body, 'This is a title\n');
    assert.equal(parsed.object.info, 'test string\n');
    assert.equal(parsed.object.text, 'test string\n');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.deepEqual(parsed.flags, [{text: false, color: false}]);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, 'test string\n');
    assert.equal(parsed.arrayOfObjects[1].text, 'test string\n');
    assert.equal(parsed.arrayOfObjects[2].info, 'test string\n');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('parses only main properties (test without optional param)', () =>{
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    let parsed = format.parseContent(item, toParse);

    assert.equal(assert.equal(parsed.body, '<h3>This is a title</h3>\n'));
    assert.equal(parsed.arrayOfObjects[0].info, 'test string');
    assert.equal(parsed.arrayOfObjects[1].text, 'test string');
    assert.equal(parsed.arrayOfObjects[2].info, 'test string');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('does not parse', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = [
      'object',
      'objectWithNoValueOfInterest',
      'arrayOfObjects',
      'emptyObject',
      'emptyArray',
      'false'
    ];

    let parsed = format.parseContent(item, toParse, childrenToParse);

    assert.equal(parsed.object.foreign, 'should not be parsed');
    assert.equal(parsed.objectWithNoValueOfInterest.something, 'string for fun');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[3].foreign, 'should not be parsed');
    assert.equal(parsed.should, 'not be touched either');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('creates a shortLeadProperty that contains no html', () => {
    const item = {
      leadParagraph: '<p>This is an <b>HTML</b> string <a href="https://some.url">that needs to be transformed</a> in a simple string.</p><p>This is an <b>HTML</b> string <a href="https://some.url">that needs to be transformed</a> in a simple string.</p><p>This is an <b>HTML</b> string <a href="https://some.url">that needs to be transformed</a> in a simple string.</p>' // 213 Characters when cleaned.
    };
    const result = format.setShortLead(item);

    assert.equal(result.shortLead, 'This is an HTML string that needs to be transformed in a simple string.This is an HTML string that needs to be transformed in a simple...') // 70 characters
    assert.isAtMost(result.shortLead.length, 145);
    assert.isTrue(result.shortLead.includes('...'));
  });

  it('formats the markdown of the "composed" body', () => {
    const childrenToParse = ['body'];
    const item = {
      body: composedBody.body
    };
    const parsed = format.parseContent(item, [], childrenToParse);
    assert.equal(parsed.body[4].text, '<ul>\n<li>test</li>\n<li>test 2</li>\n<li>test 3</li>\n</ul>\n');
  });

});