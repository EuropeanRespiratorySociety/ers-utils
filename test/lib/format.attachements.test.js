'use strict';

const assert = require('chai').assert;
const format = require('../../').Format;

describe('Format Util (Attachements)', () => {
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
    let item = {
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
      "documents": false
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
        ],
        "documents": false
    };

    const images = ['image', 'highResImage', 'sponsor']
    const documents = ['practicalInfo', 'programme', 'documents']
    assert.deepEqual(format.parseAttachements(item, images, documents), result);
  });

  it('returns formated urls', () => {
    let item = {
      "highResImage": false,
      "sponsor": []
    };

    const result = {
      "highResImage": false,
      "sponsor": []
    };

    const images = ['image', 'highResImage', 'sponsor']
    const documents = ['practicalInfo', 'programme', 'documents']
    assert.deepEqual(format.parseAttachements(item, images, documents), result);
  });

});