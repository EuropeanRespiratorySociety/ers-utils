const assert = require('chai').assert;
const F = require('../../lib/library.min').Format;
// const F = require('../../lib/library').Format;
const format = new F();

const baseUrl = 'https://www.ersnet.org/assets';
const images = ['image', 'highResImage', 'sponsor', 'cmeOrganisers', 'cmeOnlineModule', 'tabs', 'question']
const documents = ['practicalInfo', 'programme', 'documents']

const composedBody = require('../mocks/composed-body');
const parseAttachmentCmeOnlineModule = require('../mocks/parseAttachment-cmeonlinemodule');
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
  "sponsor": [{
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

  ],
  "documents": false,
  "arrayOfStrings": [
    "should not be parsed",
    "this either",
  ],
  _system: {
    changeset: '12:3456'
  }
};
const itemWithoutImage = {
  "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800",
  "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3",
  "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3",
  "sponsor": [{
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
  ],
  "documents": false,
  "arrayOfStrings": [
    "should not be parsed",
    "this either",
  ],
  _system: {
    changeset: '12:3456'
  }
};
const itemImageFalse = {
  "image": false,
  "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800&v=12:3456",
  "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
  "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
  "sponsor": [{
      "text": "this is the first string",
      "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
    },
    {
      "text": "this is the second string",
      "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
    },
    {
      "text": "this is the second string",
    }
  ],
  "documents": false,
  "arrayOfStrings": [
    "should not be parsed",
    "this either",
  ],
  _system: {
    changeset: '12:3456'
  }
};

describe('Format Util (Attachements) to document', () => {

  it('formats an url to document (static path)', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/989cff0ca845c2185427",
      "id": "989cff0ca845c2185427",
      "title": "Practical_Information_EBUS_Part_2.pdf",
      "qname": "o:989cff0ca845c2185427",
      "typeQName": "n:node"
    };
    assert.equal(format.attachementUrl(baseUrl, 'static', '12:3456', attachement), 'https://www.ersnet.org/assets/static?node=989cff0ca845c2185427&v=12:3456');

  });

  //for some reason, this test needs to be first if not the null param picks up a value...
  it('formats only documents', () => {
    const result = {
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
      "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "sponsor": [{
          "text": "this is the first string",
          "image": {
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
            "id": "daa976116100734310f3",
            "title": "EBUS training.jpg",
            "qname": "o:daa976116100734310f3",
            "typeQName": "n:node"
          }
        },
        {
          "text": "this is the second string",
          "image": {
            "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
            "id": "daa976116100734310f3",
            "title": "EBUS training.jpg",
            "qname": "o:daa976116100734310f3",
            "typeQName": "n:node"
          }
        },
        {
          "text": "this is the second string",
        }
      ],
      "documents": false,
      "arrayOfStrings": [
        "should not be parsed",
        "this either",
      ],
      _system: {
        changeset: '12:3456'
      }
    };
    assert.deepEqual(format.parseAttachements(item, baseUrl, [], documents), result);
  });

  it('does not format anything', () => {
    assert.deepEqual(format.parseAttachements(item, baseUrl), item);
  });

  it('does not attempt to format empty and false values', () => {
    let item = {
      "highResImage": false,
      "sponsor": []
    };

    const result = {
      "highResImage": false,
      "sponsor": []
    };
    assert.deepEqual(format.parseAttachements(item, baseUrl, images, documents), result);
  });
});

describe('Format Util (Attachements) to image', () => {
  it('formats an url to an image (preview path)', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
      "id": "daa976116100734310f3",
      "title": "EBUS training.jpg",
      "qname": "o:daa976116100734310f3",
      "typeQName": "n:node"
    };
    assert.equal(format.attachementUrl(baseUrl, 'preview', '12:3456', attachement, 256), 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img256&size=256&v=12:3456');
  });

  it('formats an url to an image (preview path) and sets a mimetype', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
      "id": "daa976116100734310f3",
      "title": "EBUS training.jpg",
      "qname": "o:daa976116100734310f3",
      "typeQName": "n:node"
    };
    assert.equal(format.attachementUrl(baseUrl, 'preview', '12:3456', attachement, 256, 'image/jpeg'), 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img256&size=256&mimetype=image/jpeg&v=12:3456');
  });

  it('returns formated image even if no image was provided but only a highResImage', () => {
    const result = {
      "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456",
      "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800&v=12:3456",
      "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "sponsor": [{
          "text": "this is the first string",
          "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
        },
        {
          "text": "this is the second string",
          "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
        },
        {
          "text": "this is the second string",
        }
      ],
      "documents": false,
      "arrayOfStrings": [
        "should not be parsed",
        "this either",
      ],
      _system: {
        changeset: '12:3456'
      }
    };
    assert.deepEqual(format.addImageFromHighResImage(itemImageFalse), result);
  });

  it('returns simple json formated urls', () => {
    const result = {
      "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456",
      "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800&v=12:3456",
      "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
      "sponsor": [{
          "text": "this is the first string",
          "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
        },
        {
          "text": "this is the second string",
          "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456"
        },
        {
          "text": "this is the second string",
        }
      ],
      "documents": false,
      "arrayOfStrings": [
        "should not be parsed",
        "this either",
      ],
      _system: {
        changeset: '12:3456'
      }
    };
    assert.deepEqual(format.parseAttachements(item, baseUrl, images, documents), result);
  });
});

describe('Format Util (Attachements) for composed body', () => {
  const item = {
    body: composedBody.body,
    _system: {
      changeset: '12:3456'
    }
  };

  const res = format.parseAttachements(item, baseUrl, ['body'], documents);

  it('formats the images of the "composed" body', () => {
    assert.equal(res.body[0].image, 'https://www.ersnet.org/assets/preview?node=ef19ecbf4da6738232ad&name=img500&size=500&v=12:3456');
    assert.equal(res.body[2].image, 'https://www.ersnet.org/assets/preview?node=4106469bed49b1dcd20d&name=img500&size=500&v=12:3456');
  });

  it('formats the documents of the "composed" body', () => {
    assert.equal(res.body[5].document, 'https://www.ersnet.org/assets/static?node=4106469bed49b1dcd20d&v=12:3456');
  });
});

describe('Format Util (Attachements) to image with recursivity', () => {
  it('Return formatted json with organisers images', () => {
    //Arrange
    const input = {
      "image": {
        "id": "3e5a1c98a826c92df7b3",
        "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/3e5a1c98a826c92df7b3",
        "title": "section8-image.png",
        "qname": "o:3e5a1c98a826c92df7b3",
        "typeQName": "n:node"
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
      _system: {
        changeset: '12:3456'
      }
    }
    const output = {
      "image": "https://www.ersnet.org/assets/preview?node=3e5a1c98a826c92df7b3&name=img500&size=500&v=12:3456",
      "cmeOrganisers": [{
        "name": "Test",
        "title": "Florence",
        "image": "https://www.ersnet.org/assets/preview?node=3e5a1c98a826c92df7b3&name=img500&size=500&v=12:3456",
        "isMain": true
      }],
      _system: {
        changeset: '12:3456'
      }
    }

    //Act
    let resultOfParseAttachements = format.parseAttachements(input, baseUrl, images, documents)

    //Assert
    assert.deepEqual(resultOfParseAttachements, output);
  });

  it('Return formatted json with cmeOnlineModule and panels type video', () => {
    //Arrange
    const input = {
      "cmeOnlineModule": [{
          "title": "Discussion Video",
          "panels": [{
              "panelType": "video",
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
        },
        {
          "title": "Readings",
          "panels": [{
            "panelType": "references",
            "title": "References"
          }]
        }
      ],
      _system: {
        changeset: '12:3456'
      }
    }

    const output = {
      "cmeOnlineModule": [{
          "title": "Discussion Video",
          "panels": [{
              "panelType": "video",
              "mediaUrl": "http://urlDeLaVideo",
              "image": "https://www.ersnet.org/assets/preview?node=5cb261d429290a8eeb72&name=img500&size=500&v=12:3456"
            },
            {
              "panelType": "video",
              "mediaUrl": "http://urlDeLaVideo",
              "image": "https://www.ersnet.org/assets/preview?node=6cb261d429290a8eeb72&name=img500&size=500&v=12:3456"
            }
          ]
        },
        {
          "title": "Readings",
          "panels": [{
            "panelType": "references",
            "title": "References"
          }]
        }
      ],
      _system: {
        changeset: '12:3456'
      }
    }

    //Act
    let resultOfParseAttachements = format.parseAttachements(input, baseUrl, images, documents)

    //Asert
    assert.deepEqual(resultOfParseAttachements, output);
  });

  it('Return formatted json with cmeOnlineModule and panels type tabs', () => {
    //Arrange
    const input = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "tabs": [{
              "title": "TabPanelQCM1",
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
      }],
      _system: {
        changeset: '12:3456'
      }
    }

    const output = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "tabs",
          "title": "TabPanelQCM",
          "tabs": [{
              "title": "TabPanelQCM1",
              "media": "image",
              "imageBig": "https://www.ersnet.org/assets/preview?node=33268da51d8e77cc3a4d&name=img500&size=500&v=12:3456",
              "imageSmall": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img500&size=500&v=12:3456"
            },
            {
              "title": "TabPanelQCM2",
              "media": "video",
              "mediaUrl": "http://urlTabQcm2",
              "imageBig": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img500&size=500&v=12:3456",
              "imageSmall": "https://www.ersnet.org/assets/preview?node=bf6ef8bf23d45ff2a740&name=img500&size=500&v=12:3456"
            }
          ]
        }]
      }],
      _system: {
        changeset: '12:3456'
      }
    }

    //Act
    let resultOfParseAttachements = format.parseAttachements(input, baseUrl, images, documents)

    //Asert
    assert.deepEqual(resultOfParseAttachements, output);
  });

  it('Return formatted json with cmeOnlineModule and panels type question', () => {
    //Arrange
    const input = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "question",
          "question": {
            "question": "Question 1",
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
            }
          }
        }]
      }],
      _system: {
        changeset: '12:3456'
      }
    }

    const output = {
      "cmeOnlineModule": [{
        "title": "QCM",
        "panels": [{
          "panelType": "question",
          "question": {
            "question": "Question 1",
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
            "imageBig": "https://www.ersnet.org/assets/preview?node=16ebc60401402b3b0a10&name=img500&size=500&v=12:3456",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=007ca17164dea222df6f&name=img500&size=500&v=12:3456"
          }
        }]
      }],
      _system: {
        changeset: '12:3456'
      }
    }

    //Act
    let resultOfParseAttachements = format.parseAttachements(input, baseUrl, images, documents)

    //Asert
    assert.deepEqual(resultOfParseAttachements, output);
  });

  it('Return formatted json with cmeOnlineModule all type of panels type', () => {
    //Arrange
    const input = parseAttachmentCmeOnlineModule;
    const output = {
      "title": "test flo",
      "slug": "test-flo",
      "contentType": "cme_online",
      "moodleCmeId": 145,
      "cmeType": "case",
      "cmeCategory": "COPD",
      "leadParagraph": "Published 1 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
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
          "description": "Published 2 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
          "mediaUrl": "http://urlDeLaVideo",
          "image": "https://www.ersnet.org/assets/preview?node=5cb261d429290a8eeb72&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b"
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
            "imageBig": "https://www.ersnet.org/assets/preview?node=33268da51d8e77cc3a4d&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b"
          }, {
            "title": "TabPanelQCM2",
            "description": "Published 7 in the *European Respiratory Journal*.\n* [Access the article](http://erj.ersjournals.com/content/52/1/1800740) ",
            "media": "video",
            "mediaUrl": "http://urlTabQcm2",
            "imageBig": "https://www.ersnet.org/assets/preview?node=3f2d7df65bfadd61856e&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=bf6ef8bf23d45ff2a740&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b"
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
            "imageBig": "https://www.ersnet.org/assets/preview?node=16ebc60401402b3b0a10&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
            "imageSmall": "https://www.ersnet.org/assets/preview?node=007ca17164dea222df6f&name=img500&size=500&v=247705:c84fd5f01c8d521b8b8b",
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
    }

    //Act
    let resultOfParseAttachements = format.parseAttachements(input, baseUrl, images, documents)

    //Assert
    assert.deepEqual(resultOfParseAttachements, output);
  });

});