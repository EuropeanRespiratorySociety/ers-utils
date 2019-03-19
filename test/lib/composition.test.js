const assert = require('chai').assert;
const C = require('../../lib/library.min').Composition;
//const C = require('../../src/composition');
const cp = new C();

const item = {
  title: 'Title to test | this should be removed',
  body: "### This is a title\n",
  leadParagraph: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi.</p>',
  arrayOfObjects: [{
    info: "test string"
  }],
  type: 'ERS Course',
  someDate: '03/10/2017',
  flags: [],
  image: {
    ref: "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
    id: "daa976116100734310f3",
    title: "EBUS training.jpg",
    qname: "o:daa976116100734310f3",
    qname: "n:node"
  },
  document: {
    ref: "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
    id: "daa976116100734310f3",
    title: "EBUS training.jpg",
    qname: "o:daa976116100734310f3",
    qname: "n:node"
  },
  arrayOfStrings: [
    'should not be parsed',
    'this either',
  ],
  _system: {
    changeset: '12:3456'
  }
};
const item2 = {
  title: 'Title to test | this should be removed',
  body: "### This is a title\n",
  arrayOfObjects: [{
    info: "test string"
  }],
  type: 'sci',
  arrayOfStrings: [
    'should not be parsed',
    'this either',
  ]
};


const label = 'label-school';
const label2 = 'label-scientific';
const config = {
  toParse: ['body'],
  childrenToParse: ['arrayOfObjects'],
  toParseRecursively: [],
  educationTypes: [
    'ERS Course',
    'ERS Online course',
    'e-learning',
    'ERS Skill workshop',
    'ERS Skills course',
    'ERS Endorsed activity',
    'ERS Training programme',
    'Hands-on'
  ],
  edu: label,
  scientificTypes: ['sci', 'another key'],
  sci: label2,
  dateProperties: ['someDate'],
  images: ['image'],
  documents: ['document'],
  baseUrl: 'https://www.ersnet.org/assets'
};

const configCmeOnline = {
  toParse: [
    'leadParagraph',
    'description',
    'references'
  ],
  toParseRecursively: ['cmeOnlineModule'],
  childrenToParse: [
    'tabs',
    'question'
  ],
  images: [
    'image',
    'cmeOrganisers',
    'cmeOnlineModule',
    'tabs',
    'question'
  ],
  documents: [],
  dateProperties: [],
  lead: [
    'title',
    'slug',
    'leadParagraph',
    'cmeType',
    'cmeCategory',
    'cmeOrganisers',
    'diseases',
    'methods',
    'createdOn',
    'image',
    'imageDescription',
    'url',
    'uri',
    '_system',
    '_doc'
  ],
  educationTypes: [],
  scientificTypes: [],
  sci: '',
  edu: '',
  baseUrl: 'https://www.ersnet.org/assets',
  apiUrl: 'https://api.ersnet.org'
};

describe('Composition Util', () => {
  it('formats title and sets color types', () => {
    const education = cp.formatProperties(config)(item);
    const scientific = cp.formatProperties(config)(item2);
    assert.equal(education.typeColor, label);
    assert.equal(scientific.typeColor, label2);

    assert.equal(education.body, '<h3>This is a title</h3>\n');
    assert.isAtMost(education.shortLead.length, 145);
    assert.isTrue(education.shortLead.includes('...'), 145);
    assert.equal(education.arrayOfObjects[0].info, '<p>test string</p>\n');

    assert.equal(scientific.body, '<h3>This is a title</h3>\n');
    assert.equal(scientific.arrayOfObjects[0].info, '<p>test string</p>\n');

    assert.equal(education.image, 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456');
    assert.equal(education.document, 'https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456');
    assert.equal(education.someDate, '10 March, 2017');
    assert.deepEqual(education.flags, [{
      text: false,
      color: false
    }]);
    assert.equal(education.arrayOfStrings[0], 'should not be parsed');
    assert.equal(education.arrayOfStrings[1], 'this either');

    assert.equal(scientific.arrayOfStrings[0], 'should not be parsed');
    assert.equal(scientific.arrayOfStrings[1], 'this either');
  });

  it('does not format markdown', () => {
    const markdown = cp.formatProperties(config, 'markdown')(item);

    assert.equal(markdown.body, '### This is a title\n');
    assert.notEqual(markdown.body, '<h3>This is a title</h3>\n');
  });

  it('removes any html or markdown', () => {
    const raw = cp.formatProperties(config, 'raw')(item);

    assert.equal(raw.body, 'This is a title\n');
    assert.notEqual(raw.body, '<h3>This is a title</h3>\n');
    assert.notEqual(raw.body, '### This is a title\n');
  });

  it('format cmeOnline article', () => {
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
      "flags": [{
        text: false,
        color: false
      }],
      "cmeType": "case",
      "cmeCategory": "COPD",
      "leadParagraph": "<p>Published 1 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
      "shortLead": "Published 1 in the European Respiratory Journal.\n\nAccess the article \n\n",
      "image": "https://www.ersnet.org/assets/preview?node=006145e95f103ee4d1a2&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
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
        "image": "https://www.ersnet.org/assets/preview?node=3e5a1c98a826c92df7b3&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
        "isMain": true
      }],
      "cmeOnlineModule": [{
        "title": "Discussion Video",
        "panels": [{
          "panelType": "video",
          "description": "<p>Published 2 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
          "mediaUrl": "http://urlDeLaVideo",
          "image": "https://www.ersnet.org/assets/preview?node=5cb261d429290a8eeb72&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b"
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
            "imageBig": "https://www.ersnet.org/assets/preview?node=33268da51d8e77cc3a4d&name=img800&size=800&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img400&size=400&v=247705:c84fd5f01c8d521b8b8b"
          }, {
            "title": "TabPanelQCM2",
            "description": "<p>Published 7 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n",
            "media": "video",
            "mediaUrl": "http://urlTabQcm2",
            "imageBig": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img800&size=800&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=bf6ef8bf23d45ff2a740&name=img400&size=400&v=247705:c84fd5f01c8d521b8b8b"
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
            "imageBig": "https://www.ersnet.org/assets/preview?node=16ebc60401402b3b0a10&name=img800&size=800&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=007ca17164dea222df6f&name=img400&size=400&v=247705:c84fd5f01c8d521b8b8b",
            "comment": "<p>Published 10 in the <em>European Respiratory Journal</em>.</p>\n<ul>\n<li><a href=\"http://erj.ersjournals.com/content/52/1/1800740\">Access the article</a> </li>\n</ul>\n"
          }
        }]
      }],
      "diseases": [],
      "methods": [],
      "typeColor": false,
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


    const cmeOnline = cp.formatProperties(configCmeOnline)(input);
    assert.deepEqual(cmeOnline, output);
  });
});