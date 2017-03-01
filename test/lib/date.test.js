'use strict';

const assert = require('chai').assert;
const date = require('../../').Date;
const moment = require('moment');


describe('Date Util', function() {
  it('returns an object with calendar properties ', () => {
    const object = { 
            year: "2017", 
            month: "March", 
            timestamp: "1489100400000"
        };
    assert.deepEqual(date.calendar('10/03/2017'), object);
  });

  it('belongs to the calendar', () => {
    const object = {
        title: "Events Calendar"
    };
    const arrayOfObjects = [
        { title: "Something"},
        { title: "Events Calendar"},
    ]
        
    assert.isTrue(date.isCalendar(object));
    assert.isTrue(date.isCalendar(arrayOfObjects));
  });

  it('does not belong to the calendar', () => {
    const object = {
        title: "Some category"
    };
    const arrayOfObjects = [
        { title: "Some category"},
        { title: "Some category"},
    ];
        
    assert.isFalse(date.isCalendar(object));
    assert.isFalse(date.isCalendar(arrayOfObjects));
  });

  it('formats a single date', () => {  
    assert.equal(date.ersDate('12/02/2017'), '12 February, 2017');
    assert.equal(date.ersDate('08/02/2017'), '8 February, 2017', 'There is no 0 in from of single digit day');
  });

  it('formats two dates in the same month', () => {  
    assert.equal(date.ersDate('12/02/2017', '14/02/2017'), '12-14 February, 2017');
  });

  it('formats two dates over two months', () => {  
    assert.equal(date.ersDate('31/03/2017', '03/04/2017'), '31 March - 3 April, 2017');
  });

  it('returns a timestamp', () => {  
    assert.equal(date.toTimeStamp('10/03/2017'), '1489100400000');
  });

  it('is already passed', () => {  
    assert.isTrue(date.isAlreadyPassed('10/02/2017'));
  });
  
  it('is not already passed', () => {  
    assert.isFalse(date.isAlreadyPassed(moment().add(7, 'days').format('DD/MM/YYYY')));
  });

  it('is already passed (LEGACY)', () => {  
    assert.isNull(date.isAlreadyPassedLegacy('10/02/2017'));
  });
  
  it('is not already passed (LEGACY)', () => { 
    const nowInFuture = moment().add(7, 'days').format('D/MM/YYYY');
    assert.equal(date.isAlreadyPassedLegacy(
        moment()
        .add(7, 'days')
        .format('DD/MM/YYYY')), 
        date.ersDate(nowInFuture)
        );
  });

});