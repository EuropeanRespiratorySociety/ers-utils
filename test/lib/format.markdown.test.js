const assert = require('chai').assert;
const F = require('../../lib/library.min').Format;
const format = new F();
const composedBody = require('../mocks/composed-body');
//const cmeOnlineMock = require('../mocks/parseAttachment-cmeonlinemodule');

describe('Format Util (Markdown parsing)', () => {
  const item = {
    body: '### This is a title\n',
    bodyFalse: false,
    object: {
      info: 'test string',
      text: 'test string',
      foreign: 'should not be parsed'
    },
    objectWithNoValueOfInterest: {
      something: 'string for fun'
    },
    emptyObject: {},
    emptyArray: [],
    false: false,
    flags: [{
      text: false,
      color: false
    }],
    arrayOfObjects: [{
        info: 'test string'
      },
      {
        text: 'test string'
      },
      {
        info: 'test string'
      },
      {
        foreign: 'should not be parsed'
      }
    ],
    arrayOfStrings: [
      'should not be parsed',
      'this either',
    ],
    should: 'not be touched either',
    not: () => undefined
  };

  it('converts markdown to html', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel'];
    const childrenToParse = ['object', 'objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.parseContent(item, toParse, childrenToParse, []);

    assert.equal(parsed.body, '<h3>This is a title</h3>\n');
    assert.equal(parsed.object.info, '<p>test string</p>\n');
    assert.equal(parsed.object.text, '<p>test string</p>\n');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.deepEqual(parsed.flags, [{
      text: false,
      color: false
    }]);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[1].text, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfObjects[2].info, '<p>test string</p>\n');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('converts markdown to raw text', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel'];
    const childrenToParse = ['object', 'objectWithNoValueOfInterest', 'arrayOfObjects', 'emptyObject', 'emptyArray', 'false']

    let parsed = format.parseContent(item, toParse, childrenToParse, [], true);

    assert.equal(parsed.body, 'This is a title\n');
    assert.equal(parsed.object.info, 'test string\n');
    assert.equal(parsed.object.text, 'test string\n');
    assert.deepEqual(parsed.emptyObject, {});
    assert.deepEqual(parsed.emptyArray, []);
    assert.deepEqual(parsed.flags, [{
      text: false,
      color: false
    }]);
    assert.equal(parsed.false, false);
    assert.equal(parsed.arrayOfObjects[0].info, 'test string\n');
    assert.equal(parsed.arrayOfObjects[1].text, 'test string\n');
    assert.equal(parsed.arrayOfObjects[2].info, 'test string\n');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('parses only main properties (test without optional param)', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel'];
    let parsed = format.parseContent(item, toParse);

    assert.equal(assert.equal(parsed.body, '<h3>This is a title</h3>\n'));
    assert.equal(parsed.arrayOfObjects[0].info, 'test string');
    assert.equal(parsed.arrayOfObjects[1].text, 'test string');
    assert.equal(parsed.arrayOfObjects[2].info, 'test string');
    assert.equal(parsed.arrayOfStrings[0], 'should not be parsed');
    assert.equal(parsed.arrayOfStrings[1], 'this either');
  });

  it('does not parse', () => {
    const toParse = ['body', 'bodyFalse', 'notInModel'];
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

describe('Format Util (Markdown parsing) for Cme Online Module', () => {
  it('formats the markdown of cmeOnlineModule node and panels type video', () => {
    //Arrange
    const toParse = ['description'];
    const toRecursive = ['cmeOnlineModule']
    const input = {
      "cmeOnlineModule": [{
        "title": "Discussion Video",
        "panels": [{
            "panelType": "video",
            "description": "Published1 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "mediaUrl": "http://urlDeLaVideo",
            "image": {
              "id": "5cb261d429290a8eeb72",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/5cb261d429290a8eeb72",
              "title": "plain4.jpg",
              "qname": "o:5cb261d429290a8eeb72",
              "typeQName": "n:node"
            }
          },
          {
            "panelType": "video",
            "description": "Published2 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "mediaUrl": "http://urlDeLaVideo",
            "image": {
              "id": "6cb261d429290a8eeb72",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/6cb261d429290a8eeb72",
              "title": "plain4.jpg",
              "qname": "o:6cb261d429290a8eeb72",
              "typeQName": "n:node"
            }
          }
        ]
      }]
    };

    const output = {
      "cmeOnlineModule": [{
        "title": "Discussion Video",
        "panels": [{
            "panelType": "video",
            "description": "<p>Published1 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "mediaUrl": "http://urlDeLaVideo",
            "image": {
              "id": "5cb261d429290a8eeb72",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/5cb261d429290a8eeb72",
              "title": "plain4.jpg",
              "qname": "o:5cb261d429290a8eeb72",
              "typeQName": "n:node"
            }
          },
          {
            "panelType": "video",
            "description": "<p>Published2 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "mediaUrl": "http://urlDeLaVideo",
            "image": {
              "id": "6cb261d429290a8eeb72",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/6cb261d429290a8eeb72",
              "title": "plain4.jpg",
              "qname": "o:6cb261d429290a8eeb72",
              "typeQName": "n:node"
            }
          }
        ]
      }]
    };

    //Act
    const resultOfParseContent = format.parseContent(input, toParse, [], toRecursive, false);

    //Assert
    assert.deepEqual(resultOfParseContent, output);
  });

  it('formats the markdown of cmeOnlineModule node and panels type references', () => {
    //Arrange
    const toParse = ['description', 'references'];
    const toRecursive = ['cmeOnlineModule']

    //Arrange
    const input = {
      "cmeOnlineModule": [{
        "title": "Readings",
        "panels": [{
          "panelType": "references",
          "title": "References",
          "description": "PublishedDesc in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "references": "PublishedRef in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) "
        }]
      }]
    }

    const output = {
      "cmeOnlineModule": [{
        "title": "Readings",
        "panels": [{
          "panelType": "references",
          "title": "References",
          "description": "<p>PublishedDesc in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "references": "<p>PublishedRef in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n"
        }]
      }]
    }

    //Act
    const resultOfParseContent = format.parseContent(input, toParse, [], toRecursive, false);

    //Assert
    assert.deepEqual(resultOfParseContent, output);
  });

  it('formats the markdown of cmeOnlineModule node and panels type tabs', () => {
    //Arrange
    const toParse = ['description', 'references'];
    const toParseRecursivly = ['cmeOnlineModule'];
    const toChildrenToParse = ['tabs'];
    //Arrange
    const input = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "description": "Published1 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "tabs": [{
              "title": "TabPanelQCM1",
              "description": "Published2 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
              "media": "image",
              "imageBig": {
                "id": "33268da51d8e77cc3a4d",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/33268da51d8e77cc3a4d",
                "title": "logo1.jpg",
                "qname": "o:33268da51d8e77cc3a4d",
                "typeQName": "n:node"
              },
              "imageSmall": {
                "id": "3f2d7df65bfadd61856e",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
                "title": "Celine Mascaux.PNG",
                "qname": "o:3f2d7df65bfadd61856e",
                "typeQName": "n:node"
              }
            },
            {
              "title": "TabPanelQCM2",
              "description": "Published3 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
              "media": "video",
              "mediaUrl": "http://urlTabQcm2",
              "imageBig": {
                "id": "3f2d7df65bfadd61856e",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
                "title": "Celine Mascaux.PNG",
                "qname": "o:3f2d7df65bfadd61856e",
                "typeQName": "n:node"
              },
              "imageSmall": {
                "id": "bf6ef8bf23d45ff2a740",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/bf6ef8bf23d45ff2a740",
                "title": "BILogo.jpg",
                "qname": "o:bf6ef8bf23d45ff2a740",
                "typeQName": "n:node"
              }
            }
          ]
        }]
      }]
    }

    const output = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "description": "<p>Published1 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "tabs": [{
              "title": "TabPanelQCM1",
              "description": "<p>Published2 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
              "media": "image",
              "imageBig": {
                "id": "33268da51d8e77cc3a4d",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/33268da51d8e77cc3a4d",
                "title": "logo1.jpg",
                "qname": "o:33268da51d8e77cc3a4d",
                "typeQName": "n:node"
              },
              "imageSmall": {
                "id": "3f2d7df65bfadd61856e",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
                "title": "Celine Mascaux.PNG",
                "qname": "o:3f2d7df65bfadd61856e",
                "typeQName": "n:node"
              }
            },
            {
              "title": "TabPanelQCM2",
              "description": "<p>Published3 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
              "media": "video",
              "mediaUrl": "http://urlTabQcm2",
              "imageBig": {
                "id": "3f2d7df65bfadd61856e",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
                "title": "Celine Mascaux.PNG",
                "qname": "o:3f2d7df65bfadd61856e",
                "typeQName": "n:node"
              },
              "imageSmall": {
                "id": "bf6ef8bf23d45ff2a740",
                "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/bf6ef8bf23d45ff2a740",
                "title": "BILogo.jpg",
                "qname": "o:bf6ef8bf23d45ff2a740",
                "typeQName": "n:node"
              }
            }
          ]
        }]
      }]
    }

    //Act
    const resultOfParseContent = format.parseContent(input, toParse, toChildrenToParse, toParseRecursivly, false);

    //Assert
    assert.deepEqual(resultOfParseContent, output);
  });

  it('formats the markdown of cmeOnlineModule node and panels type question', () => {
    //Arrange
    const toParse = ['description', 'references'];
    const toParseRecursivly = ['cmeOnlineModule'];
    const toChildrenToParse = ['tabs', 'question'];
    //Arrange
    //Arrange
    const input = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "question",
          "description": "Published1 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "question": {
            "question": "Question 1",
            "description": "Published2 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "isMultiChoice": true,
            "answers": [{
                "text": "sdfdsf",
                "isCorrect": false
              },
              {
                "text": "sfdsfd",
                "isCorrect": false
              }
            ],
            "media": "image",
            "imageBig": {
              "id": "16ebc60401402b3b0a10",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/16ebc60401402b3b0a10",
              "title": "shutterstock_antibiotics2.jpg",
              "qname": "o:16ebc60401402b3b0a10",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "007ca17164dea222df6f",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/007ca17164dea222df6f",
              "title": "St. Gallen exam cover.jpg",
              "qname": "o:007ca17164dea222df6f",
              "typeQName": "n:node"
            },
            "comment": "Published3 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) "
          }
        }]
      }]
    }

    const output = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "question",
          "description": "<p>Published1 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "question": {
            "question": "Question 1",
            "description": "<p>Published2 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "isMultiChoice": true,
            "answers": [{
                "text": "sdfdsf",
                "isCorrect": false
              },
              {
                "text": "sfdsfd",
                "isCorrect": false
              }
            ],
            "media": "image",
            "imageBig": {
              "id": "16ebc60401402b3b0a10",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/16ebc60401402b3b0a10",
              "title": "shutterstock_antibiotics2.jpg",
              "qname": "o:16ebc60401402b3b0a10",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "007ca17164dea222df6f",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/007ca17164dea222df6f",
              "title": "St. Gallen exam cover.jpg",
              "qname": "o:007ca17164dea222df6f",
              "typeQName": "n:node"
            },
            "comment": "<p>Published3 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n"
          }
        }]
      }]
    }


    //Act
    const resultOfParseContent = format.parseContent(input, toParse, toChildrenToParse, toParseRecursivly, false);

    //Assert
    assert.deepEqual(resultOfParseContent, output);
  });

  it('formats the markdown of cmeOnlineModule node all type of panels type', () => {
    //Arrange
    const toParse = [
      'body',
      'leadParagraph',
      'references',
      'popUp',
      'cancellationPolicy',
      'travelInfo',
      'technicalInfo',
      'description',
      'references'
    ];
    const toParseRecursivly = ['cmeOnlineModule'];
    const toChildrenToParse = [
      'venue',
      'suggestedAccommodation',
      'ebusVenues',
      'bursaryApplication',
      'tabs',
      'question'
    ];
    //Arrange
    const input = {
      "title": "test flo",
      "slug": "test-flo",
      "contentType": "cme_online",
      "moodleCmeId": 145,
      "cmeType": "case",
      "cmeCategory": "COPD",
      "leadParagraph": "Published 1 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
      "image": {
        "id": "006145e95f103ee4d1a2",
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/006145e95f103ee4d1a2",
        "title": "oncology-thoracic-lung-cancer-1.jpg",
        "qname": "o:006145e95f103ee4d1a2",
        "typeQName": "n:node"
      },
      "itemImageAlignment": "center",
      "itemImageBackgroundSize": "cover",
      "imageSize": "small",
      "category": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/8e1f9c610877206a850e",
        "id": "8e1f9c610877206a850e",
        "title": "CME Online",
        "qname": "o:8e1f9c610877206a850e",
        "typeQName": "ers:category"
      },
      "cmeOrganisers": [{
        "name": "Test",
        "title": "Florence",
        "image": {
          "id": "3e5a1c98a826c92df7b3",
          "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3e5a1c98a826c92df7b3",
          "title": "section8-image.png",
          "qname": "o:3e5a1c98a826c92df7b3",
          "typeQName": "n:node"
        },
        "isMain": true
      }],
      "cmeOnlineModule": [{
        "title": "Discussion Video",
        "panels": [{
          "panelType": "video",
          "description": "Published 2 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "mediaUrl": "http://urlDeLaVideo",
          "image": {
            "id": "5cb261d429290a8eeb72",
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/5cb261d429290a8eeb72",
            "title": "plain4.jpg",
            "qname": "o:5cb261d429290a8eeb72",
            "typeQName": "n:node"
          }
        }]
      }, {
        "title": "Readings",
        "panels": [{
          "panelType": "references",
          "title": "References",
          "description": "Published 3 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "references": "Published 4 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) "
        }]
      }, {
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "description": "Published 5 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "tabs": [{
            "title": "TabPanelQCM1",
            "description": "Published 6 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "media": "image",
            "imageBig": {
              "id": "33268da51d8e77cc3a4d",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/33268da51d8e77cc3a4d",
              "title": "logo1.jpg",
              "qname": "o:33268da51d8e77cc3a4d",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "3f2d7df65bfadd61856e",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
              "title": "Celine Mascaux.PNG",
              "qname": "o:3f2d7df65bfadd61856e",
              "typeQName": "n:node"
            }
          }, {
            "title": "TabPanelQCM2",
            "description": "Published 7 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "media": "video",
            "mediaUrl": "http://urlTabQcm2",
            "imageBig": {
              "id": "3f2d7df65bfadd61856e",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
              "title": "Celine Mascaux.PNG",
              "qname": "o:3f2d7df65bfadd61856e",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "bf6ef8bf23d45ff2a740",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/bf6ef8bf23d45ff2a740",
              "title": "BILogo.jpg",
              "qname": "o:bf6ef8bf23d45ff2a740",
              "typeQName": "n:node"
            }
          }]
        }, {
          "panelType": "question",
          "description": "Published 8 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "question": {
            "question": "Question 1",
            "description": "Published 9 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "isMultiChoice": true,
            "answers": [{
              "text": "sdfdsf",
              "isCorrect": false
            }, {
              "text": "sfdsfd",
              "isCorrect": false
            }],
            "media": "image",
            "imageBig": {
              "id": "16ebc60401402b3b0a10",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/16ebc60401402b3b0a10",
              "title": "shutterstock_antibiotics2.jpg",
              "qname": "o:16ebc60401402b3b0a10",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "007ca17164dea222df6f",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/007ca17164dea222df6f",
              "title": "St. Gallen exam cover.jpg",
              "qname": "o:007ca17164dea222df6f",
              "typeQName": "n:node"
            },
            "comment": "Published 10 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) "
          }
        }]
      }],
      "diseases": [],
      "methods": [],
      "_doc": "e2fa5aa79defc4a0051f",
      "_system": {
        "deleted": false,
        "changeset": "247705:c84fd5f01c8d521b8b8b",
        "created_on": {
          "timestamp": "12-Dec-2018 15:55:33",
          "year": 2018,
          "month": 11,
          "day_of_month": 12,
          "hour": 15,
          "minute": 55,
          "second": 33,
          "millisecond": 117,
          "ms": 1544630133117,
          "iso_8601": "2018-12-12T15:55:33Z"
        },
        "created_by": "fblocklet",
        "created_by_principal_id": "54933ca487265db31b1b",
        "created_by_principal_domain_id": "869b74f51afe687b5b74",
        "modified_on": {
          "timestamp": "13-Feb-2019 14:09:41",
          "year": 2019,
          "month": 1,
          "day_of_month": 13,
          "hour": 14,
          "minute": 9,
          "second": 41,
          "millisecond": 977,
          "ms": 1550066981977,
          "iso_8601": "2019-02-13T14:09:41Z"
        },
        "modified_by": "fblocklet",
        "modified_by_principal_id": "54933ca487265db31b1b",
        "modified_by_principal_domain_id": "869b74f51afe687b5b74",
        "edited_on": {
          "timestamp": "13-Feb-2019 14:09:41",
          "year": 2019,
          "month": 1,
          "day_of_month": 13,
          "hour": 14,
          "minute": 9,
          "second": 41,
          "millisecond": 977,
          "ms": 1550066981977,
          "iso_8601": "2019-02-13T14:09:41Z"
        },
        "edited_by": "fblocklet",
        "edited_by_principal_id": "54933ca487265db31b1b",
        "edited_by_principal_domain_id": "869b74f51afe687b5b74",
        "previousChangeset": "247703:cbf6c3c3dd0c17453e06"
      },
      "_statistics": {
        "a:has_role": 1,
        "a:has_role_INCOMING": 1,
        "ers:category-association": 1,
        "ers:category-association_OUTGOING": 1,
        "ers:image-association": 9,
        "ers:image-association_OUTGOING": 9
      },
      "_qname": "o:e2fa5aa79defc4a0051f"
    };

    const output = {
      "title": "test flo",
      "slug": "test-flo",
      "contentType": "cme_online",
      "moodleCmeId": 145,
      "cmeType": "case",
      "cmeCategory": "COPD",
      "leadParagraph": "<p>Published 1 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
      "image": {
        "id": "006145e95f103ee4d1a2",
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/006145e95f103ee4d1a2",
        "title": "oncology-thoracic-lung-cancer-1.jpg",
        "qname": "o:006145e95f103ee4d1a2",
        "typeQName": "n:node"
      },
      "itemImageAlignment": "center",
      "itemImageBackgroundSize": "cover",
      "imageSize": "small",
      "category": {
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/8e1f9c610877206a850e",
        "id": "8e1f9c610877206a850e",
        "title": "CME Online",
        "qname": "o:8e1f9c610877206a850e",
        "typeQName": "ers:category"
      },
      "cmeOrganisers": [{
        "name": "Test",
        "title": "Florence",
        "image": {
          "id": "3e5a1c98a826c92df7b3",
          "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3e5a1c98a826c92df7b3",
          "title": "section8-image.png",
          "qname": "o:3e5a1c98a826c92df7b3",
          "typeQName": "n:node"
        },
        "isMain": true
      }],
      "cmeOnlineModule": [{
        "title": "Discussion Video",
        "panels": [{
          "panelType": "video",
          "description": "<p>Published 2 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "mediaUrl": "http://urlDeLaVideo",
          "image": {
            "id": "5cb261d429290a8eeb72",
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/5cb261d429290a8eeb72",
            "title": "plain4.jpg",
            "qname": "o:5cb261d429290a8eeb72",
            "typeQName": "n:node"
          }
        }]
      }, {
        "title": "Readings",
        "panels": [{
          "panelType": "references",
          "title": "References",
          "description": "<p>Published 3 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "references": "<p>Published 4 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
        }]
      }, {
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "description": "<p>Published 5 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "tabs": [{
            "title": "TabPanelQCM1",
            "description": "<p>Published 6 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "media": "image",
            "imageBig": {
              "id": "33268da51d8e77cc3a4d",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/33268da51d8e77cc3a4d",
              "title": "logo1.jpg",
              "qname": "o:33268da51d8e77cc3a4d",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "3f2d7df65bfadd61856e",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
              "title": "Celine Mascaux.PNG",
              "qname": "o:3f2d7df65bfadd61856e",
              "typeQName": "n:node"
            }
          }, {
            "title": "TabPanelQCM2",
            "description": "<p>Published 7 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "media": "video",
            "mediaUrl": "http://urlTabQcm2",
            "imageBig": {
              "id": "3f2d7df65bfadd61856e",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3f2d7df65bfadd61856e",
              "title": "Celine Mascaux.PNG",
              "qname": "o:3f2d7df65bfadd61856e",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "bf6ef8bf23d45ff2a740",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/bf6ef8bf23d45ff2a740",
              "title": "BILogo.jpg",
              "qname": "o:bf6ef8bf23d45ff2a740",
              "typeQName": "n:node"
            }
          }]
        }, {
          "panelType": "question",
          "description": "<p>Published 8 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "question": {
            "question": "Question 1",
            "description": "<p>Published 9 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "isMultiChoice": true,
            "answers": [{
              "text": "sdfdsf",
              "isCorrect": false
            }, {
              "text": "sfdsfd",
              "isCorrect": false
            }],
            "media": "image",
            "imageBig": {
              "id": "16ebc60401402b3b0a10",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/16ebc60401402b3b0a10",
              "title": "shutterstock_antibiotics2.jpg",
              "qname": "o:16ebc60401402b3b0a10",
              "typeQName": "n:node"
            },
            "imageSmall": {
              "id": "007ca17164dea222df6f",
              "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/007ca17164dea222df6f",
              "title": "St. Gallen exam cover.jpg",
              "qname": "o:007ca17164dea222df6f",
              "typeQName": "n:node"
            },
            "comment": "<p>Published 10 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          }
        }]
      }],
      "diseases": [],
      "methods": [],
      "_doc": "e2fa5aa79defc4a0051f",
      "_system": {
        "deleted": false,
        "changeset": "247705:c84fd5f01c8d521b8b8b",
        "created_on": {
          "timestamp": "12-Dec-2018 15:55:33",
          "year": 2018,
          "month": 11,
          "day_of_month": 12,
          "hour": 15,
          "minute": 55,
          "second": 33,
          "millisecond": 117,
          "ms": 1544630133117,
          "iso_8601": "2018-12-12T15:55:33Z"
        },
        "created_by": "fblocklet",
        "created_by_principal_id": "54933ca487265db31b1b",
        "created_by_principal_domain_id": "869b74f51afe687b5b74",
        "modified_on": {
          "timestamp": "13-Feb-2019 14:09:41",
          "year": 2019,
          "month": 1,
          "day_of_month": 13,
          "hour": 14,
          "minute": 9,
          "second": 41,
          "millisecond": 977,
          "ms": 1550066981977,
          "iso_8601": "2019-02-13T14:09:41Z"
        },
        "modified_by": "fblocklet",
        "modified_by_principal_id": "54933ca487265db31b1b",
        "modified_by_principal_domain_id": "869b74f51afe687b5b74",
        "edited_on": {
          "timestamp": "13-Feb-2019 14:09:41",
          "year": 2019,
          "month": 1,
          "day_of_month": 13,
          "hour": 14,
          "minute": 9,
          "second": 41,
          "millisecond": 977,
          "ms": 1550066981977,
          "iso_8601": "2019-02-13T14:09:41Z"
        },
        "edited_by": "fblocklet",
        "edited_by_principal_id": "54933ca487265db31b1b",
        "edited_by_principal_domain_id": "869b74f51afe687b5b74",
        "previousChangeset": "247703:cbf6c3c3dd0c17453e06"
      },
      "_statistics": {
        "a:has_role": 1,
        "a:has_role_INCOMING": 1,
        "ers:category-association": 1,
        "ers:category-association_OUTGOING": 1,
        "ers:image-association": 9,
        "ers:image-association_OUTGOING": 9
      },
      "_qname": "o:e2fa5aa79defc4a0051f"
    }


    //Act
    const resultOfParseContent1 = format.parseContent(input, toParse, toChildrenToParse, toParseRecursivly, false);
    //Assert
    assert.deepEqual(resultOfParseContent1, output);
  });
});