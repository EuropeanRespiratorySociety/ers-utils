const assert = require('chai').assert;
// const F = require('../../lib/library.min').Format;
const F = require('../../lib/library').Format;
const format = new F();

const baseUrl = 'https://www.ersnet.org/assets';
const images = ['image', 'highResImage', 'sponsor']
const documents = ['practicalInfo', 'programme', 'documents']

const composedBody = require('./composed-body-example.json');
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
  "sponsor": [
      {
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

describe('Format Util (Attachements)', () => {

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

  it('formats an url to an image (preview path)', () => {
    const attachement = {
      "ref": "node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b6b2871b2d9cf6b4996b/daa976116100734310f3",
      "id": "daa976116100734310f3",
      "title": "EBUS training.jpg",
      "qname": "o:daa976116100734310f3",
      "typeQName": "n:node"
    };
    assert.equal(format.attachementUrl(baseUrl, 'preview', '12:3456', attachement, 256 ), 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img256&size=256&v=12:3456');
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
      "sponsor": [
          {
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
        _system:{
          changeset: '12:3456'
        }
    };
  assert.deepEqual(format.parseAttachements(item, baseUrl, null, documents), result);
});

it('returns formated urls', () => {
  const result = {
    "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456",
    "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800&v=12:3456",
    "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
    "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
    "sponsor": [
        {
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
      _system:{
        changeset: '12:3456'
      }
  };
  assert.deepEqual(format.parseAttachements(item, baseUrl, images, documents), result);
});

it('returns formated image even if no image was provided but only a highResImage', () => {
  const result = {
    "image": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500&v=12:3456",
    "highResImage": "https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img1800&size=1800&v=12:3456",
    "programme": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
    "practicalInfo": "https://www.ersnet.org/assets/static?node=daa976116100734310f3&v=12:3456",
    "sponsor": [
        {
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
      _system:{
        changeset: '12:3456'
      }
  };
  assert.deepEqual(format.addImageFromHighResImage(itemImageFalse), result);
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

describe('Format Util (Attachements) for comosed body', () => {
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