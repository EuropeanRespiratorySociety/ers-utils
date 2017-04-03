'use strict';

const assert = require('chai').assert;
const format = require('../../').Format;


describe('Format Util (General)', () => {
  it('formats the title of the item object', () => {
    const item = {title: 'Title to test | this should be removed'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  it('does nothing to the title', () => {
    const item = {title: 'Title to test'};
    assert.equal(format.title(item).title, 'Title to test');
  });

  it('returns false if there is no title', () => {
    const item = {title: false};
    assert.isFalse(format.title(item).title);
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

  it('returns the class color for a type', () => {
    const types = ["ERS Course", "ERS Online course", "e-learning", "ERS Skill workshop", "ERS Skills course", "ERS Endorsed activity", "Hands-on"];
    const types2 = ['Research Seminar'];
    const label = 'label-school';
    const label2 = 'label-scientific';
    assert.equal(format.typeColor("ERS Course", types, label), 'label-school');
    assert.equal(format.typeColor('Research Seminar', types2, label2), 'label-scientific');
    
  });
  it('returns false if no type is set', () => {
    const types = ["ERS Course", "ERS Online course", "e-learning", "ERS Skill workshop", "ERS Skills course", "ERS Endorsed activity", "Hands-on"];  
    assert.isFalse(format.typeColor(false, types))    
  });

  it('returns an article/item with an addtional property: typeColor set to the correct value', () => {
    const types = ["ERS Course", "ERS Online course", "e-learning", "ERS Skill workshop", "ERS Skills course", "ERS Endorsed activity", "Hands-on"];
    const types2 = ["Research Seminar"];
    const item = {type:'ERS Course'};
    const item2 = {type:'Research Seminar'};
    const item3 = {type:false};
    const label = 'label-school';
    const label2 = 'label-scientific';
    assert.deepEqual(format.setTypeColor(item, types, label), {type:'ERS Course', typeColor: 'label-school'});
    assert.deepEqual(format.setTypeColor(item2, types2, label2), {type:'Research Seminar', typeColor: 'label-scientific'});
    assert.deepEqual(format.setTypeColor(item3, types), {type:false, typeColor: false});
  })

  it('returns formated flags', () => {
    const item = {
        flags:[
            {
                text: "flag text",
                color: "danger"
            }
        ]
    };
    const noFlags = {
      flags: [{
        text: false,
        color: false
      }]
    }
     assert.deepEqual(format.setFlags(item), {flags:[{text:"flag text", color:"danger"}]}); 
     assert.deepEqual(format.setFlags(noFlags), {flags:[{text: false, color: false}]}); 
  });

  it('returns flag text length that is at most 40 chars', () => {
    const item = {
        flags:[
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a mi ut nunc rhoncus pharetra at ut neque. Nulla facilisi.",
                color: "danger"
            }
        ]
    };
    assert.isAtMost(format.setFlags(item).flags[0].text.length, 40); 
  });

  it('returns MANY formated flags', () => {
    const item = {
        something: 'that should not be touched',
        flags:[
            {
                text: "flag text",
                color: "danger"
            },
            {
                text: "flag text 2",
                color: "other color"
            }
        ]
    };
     assert.deepEqual(format.setFlags(item), {
        something: 'that should not be touched',
        flags:[
          {text:"flag text", color:"danger"},
          {text:"flag text 2", color:"other color"}
        ]}); 
  });

  it('returns formated flags properties set to false', () => {
        const item = {flags:[]};
      assert.deepEqual(format.setFlags(item), {flags:[{text:false, color:false}]})
  });

  it('parses video', () => {
    const url = 'https://youtu.be/jglUWD3KMh4';
    format.parseVideo(url);
    assert.equal(format.parseVideo(url), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4" frameborder="0" allowfullscreen></iframe>');
  });

  it('parses video with query params', () => {
    const url = 'https://youtu.be/jglUWD3KMh4';
    const param = {query: {test: 'query'}};
    const params = {query: {test: 'query', second: 'second-query'}};
    assert.equal(format.parseVideo(url, param), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4?test=query" frameborder="0" allowfullscreen></iframe>');
    assert.equal(format.parseVideo(url, params), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4?test=query&second=second-query" frameborder="0" allowfullscreen></iframe>');
  });

  it('parses video with iframe attributes', () => {
    const url = 'https://youtu.be/jglUWD3KMh4';
    const attribute = {attr: {width: 400}};
    const attributes = {attr: {width: 400, height: 200, other: 'test'}};
    assert.equal(format.parseVideo(url, attribute), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4" width="400" frameborder="0" allowfullscreen></iframe>');
    assert.equal(format.parseVideo(url, attributes), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4" width="400" height="200" other="test" frameborder="0" allowfullscreen></iframe>');  
  });

  it('parses video with iframe attributes and query params', () => {
    const url = 'https://youtu.be/jglUWD3KMh4';
    const opts = {query: {test: 'query', second: 'second-query'}, attr: {width: 400, height: 200, other: 'test'}};
    assert.equal(format.parseVideo(url, opts), '<iframe src="//www.youtube.com/embed/jglUWD3KMh4?test=query&second=second-query" width="400" height="200" other="test" frameborder="0" allowfullscreen></iframe>');  
  });

  it('serializes an object into a querystring', () => {
    const obj = {test: 'first-query', second: 'second-query', qname:'o:f913cff03624ac461283f'};
    assert.equal(format.serializeQuery(obj), '?test=first-query&second=second-query&qname=o%3Af913cff03624ac461283f');  
  });

  it('returns only the items contained in an array', () => {
    const obj = {
      first: 'first item', 
      second: 'second item',
      third: {an: 'other',
              object:'to test'},
      fourth: ['and', 'an', 'array']
    };
    const array = ['first', 'third', 'fourth'];
    
    assert.deepEqual(format.filter(obj, array), {
            first: 'first item',
            third: {an: 'other',
              object:'to test'},
            fourth: ['and', 'an', 'array']
          });
  });

  it('returns a string with no html at all', () => {
    const string = '<h3>Title</h3><p>this is some text</p>'
    const result = 'Titlethis is some text'
    assert.equal(format.clean(string), result);
  });

});