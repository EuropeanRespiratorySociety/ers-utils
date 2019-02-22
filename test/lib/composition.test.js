const assert = require('chai').assert;
const C = require('../../lib/library.min').Composition;
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

describe('Composition Util', () => {
  it('formats title and sets color types', () => {
    const education = cp.formatProperties(config)(item);
    const scientific = cp.formatProperties(config)(item2);
    console.log(JSON.stringify(education));
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
});