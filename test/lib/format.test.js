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
    const toParse = ['body', 'bodyFalse', 'notInModel' ];
    const childrenToParse = ['object','objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']
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

    let parsed = format.markDownToHtml(item, toParse, childrenToParse)

    assert.equal(parsed.body, '<h3>This is a title</h3>\n');
    assert.equal(parsed.object.info, '<p>test string</p>\n');
    assert.equal(parsed.object.text, '<p>test string</p>\n');
    assert.equal(parsed.object.foreign, 'should not be parsed');
    assert.equal(parsed.objectWithNoValueOfInterest.something, 'string for fun');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[2].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[3].foreign, 'should not be parsed');
    assert.equal(parsed.should, 'not be touched either');
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

  it('formats an url to document (static path)', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/989cff0ca845c2185427",
      "id": "989cff0ca845c2185427",
      "title": "Practical_Information_EBUS_Part_2.pdf",
      "qname": "o:989cff0ca845c2185427",
      "typeQName": "n:node"
    };
    const baseUrl = 'https://www.ersnet.org/assets';
    assert.equal(format.attachementUrl(baseUrl, 'static', attachement ), 'https://www.ersnet.org/assets/static?node=989cff0ca845c2185427');

  });

  it('formats an url to an image (preview path)', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
      "id": "daa976116100734310f3",
      "title": "EBUS training.jpg",
      "qname": "o:daa976116100734310f3",
      "typeQName": "n:node"
    };
    const baseUrl = 'https://www.ersnet.org/assets';
    assert.equal(format.attachementUrl(baseUrl, 'preview', attachement, 256 ), 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img256&size=256');
  });

  it('returns formated urls', () => {
    const item = {
      "image": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
        "id": "daa976116100734310f3",
        "title": "EBUS training.jpg",
        "qname": "o:daa976116100734310f3",
        "typeQName": "n:node"
      },
      "highResImage": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
        "id": "daa976116100734310f3",
        "title": "EBUS training.jpg",
        "qname": "o:daa976116100734310f3",
        "typeQName": "n:node"
      },
      "programme": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
        "id": "daa976116100734310f3",
        "title": "EBUS training.jpg",
        "qname": "o:daa976116100734310f3",
        "typeQName": "n:node"
      },
      "practicalInfo": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
        "id": "daa976116100734310f3",
        "title": "EBUS training.jpg",
        "qname": "o:daa976116100734310f3",
        "typeQName": "n:node"
      },
      "sponsor": [
        {
        "text": "this is the first string",
        "image": {
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
            "id": "daa976116100734310f3",
            "title": "EBUS training.jpg",
            "qname": "o:daa976116100734310f3",
            "typeQName": "n:node"
          },
        },
        {
        "text": "this is the second string",
        "image": {
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
            "id": "daa976116100734310f3",
            "title": "EBUS training.jpg",
            "qname": "o:daa976116100734310f3",
            "typeQName": "n:node"
          },
        },
        {
          "text": "this is the second string",
        }

      ]
    };

    const result = {
      "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500",
      "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800",
      "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3",
      "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3",
      "sponsor": [
        {
        "text": "this is the first string",
        "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500"
        },
        {
        "text": "this is the second string",
        "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500"
        },
        {
          "text": "this is the second string",
        }
      ]
    };

    const images = ['image', 'highResImage', 'sponsor']
    const documents = ['practicalInfo', 'programme']
    assert.deepEqual(format.parseAttachements(item, images, documents), result);
  });

});