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
    assert.equal(format.typeColor("ERS Course", types), 'label-school');
    assert.equal(format.typeColor('Research Seminar', types), 'label-scientific');
    
  });
  it('returns false if no type is set', () => {
    const types = ["ERS Course", "ERS Online course", "e-learning", "ERS Skill workshop", "ERS Skills course", "ERS Endorsed activity", "Hands-on"];  
    assert.isFalse(format.typeColor(false, types))    
  });

  it('returns an article/item with an addtional property: typeColor set to the correct value', () => {
    const types = ["ERS Course", "ERS Online course", "e-learning", "ERS Skill workshop", "ERS Skills course", "ERS Endorsed activity", "Hands-on"];
    const item = {type:'ERS Course'};
    const item2 = {type:'Research Seminar'};
    const item3 = {type:false};
    assert.deepEqual(format.setTypeColor(item, types), {type:'ERS Course', typeColor: 'label-school'});
    assert.deepEqual(format.setTypeColor(item2, types), {type:'Research Seminar', typeColor: 'label-scientific'});
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
     assert.deepEqual(format.setFlags(item), {flags:[{text:"flag text", color:"danger"}]}); 
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
     assert.deepEqual(format.setFlags(item), {flags:[
         {text:"flag text", color:"danger"},
         {text:"flag text 2", color:"other color"}
         ]}); 
  });

  it('returns formated flags properties set to false', () => {
        const item = {flags:[]};
      assert.deepEqual(format.setFlags(item), {flags:[{text:false, color:false}]})
  });
});