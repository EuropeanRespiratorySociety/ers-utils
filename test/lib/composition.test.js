const assert = require('chai').assert;
const cp = require('../../').Composition;

describe('Composition Util', () => {  
  it('formats title and sets color types', () => {
    const item = {
      title: 'Title to test | this should be removed',
      body: "### This is a title\n",
      arrayOfObjects: [
        { info: "test string" }
      ],
      type: 'edu',
      someDate: '03/10/2017',
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
      }
    };
    const item2 = {
      title: 'Title to test | this should be removed',      
      body: "### This is a title\n",
      arrayOfObjects: [
        { info: "test string" }
      ],
      type: 'sci'
    };
    const label = 'label-school';
    const label2 = 'label-scientific';
    const config = {
        toParse: ['body'],
        childrenToParse: ['arrayOfObjects'],
        educationTypes : ['edu', 'something else'],
        edu : label,
        scientificTypes : ['sci', 'another key'],
        sci : label2,
        dateProperties:['someDate'],
        images: ['image'],
        documents: ['document'],
        baseUrl: 'https://www.ersnet.org/assets'
    };

    const education = cp.formatProperties(config)(item);
    const scientific = cp.formatProperties(config)(item2);
    assert.equal(education.typeColor, label);
    assert.equal(scientific.typeColor, label2);
    assert.equal(education.body, '<h3>This is a title</h3>\n');
    assert.equal(education.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(scientific.body, '<h3>This is a title</h3>\n');
    assert.equal(scientific.arrayOfObjects[0].info, '<p>test string</p>\n');
    assert.equal(education.image, 'https://www.ersnet.org/assets/preview?node=daa976116100734310f3&name=img500&size=500');
    assert.equal(education.document, 'https://www.ersnet.org/assets/static?node=daa976116100734310f3');
    assert.equal(education.someDate, '10 March, 2017')
  });
});