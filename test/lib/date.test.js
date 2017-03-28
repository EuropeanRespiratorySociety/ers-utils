'use strict';

const assert = require('chai').assert;
const date = require('../../').Date;
const moment = require('moment');


describe('Date Util', function() {
  it('returns an object with calendar properties set', () => {
    const mockDate = moment().add(7,'days');
    const dateString = mockDate.format('MM/DD/YYYY');
    const mockDateFromString = moment(dateString, 'MM/DD/YYYY') //We need to do this for the timestamp to be exactly the same
    const item = {title: "This is an item title", eventDate: dateString};
    const object = {
      title: "This is an item title",
      eventDate: dateString,
      calendar: { 
        year: mockDateFromString.format('YYYY'), 
        month: mockDateFromString.format('MMMM'), 
        timestamp: mockDateFromString.unix()
      }
    };
    assert.deepEqual(date.calendar(item), object);
  });

  it('belongs to the calendar', () => {
    const object = {
        title: "Events Calendar"
    };
    const arrayOfObjects = [
        { title: "Something"},
        { title: "Events Calendar"},
    ]

    const emptyObj = {};
    const emptyArray = [];
    const some = 'string';
        
    assert.isTrue(date.isCalendar(object));
    assert.isTrue(date.isCalendar(arrayOfObjects));
    assert.isFalse(date.isCalendar(emptyObj));
    assert.isFalse(date.isCalendar(emptyArray));
    assert.isFalse(date.isCalendar(some));
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
    assert.equal(date.ersDate('02/12/2017'), '12 February, 2017');
    assert.equal(date.ersDate('02/08/2017'), '8 February, 2017', 'There is no 0 in from of single digit day');
  });

  it('does parse a date which is not a valid date', () => {  
    assert.equal(date.ersDate('this is a string'), 'this is a string');
    assert.equal(date.ersDate(12345), 12345);
  });

  it('formats two dates in the same month', () => {  
    assert.equal(date.ersDate('02/12/2017', '02/14/2017'), '12-14 February, 2017');
  });

  it('formats two dates over two months', () => {  
    assert.equal(date.ersDate('03/31/2017', '04/03/2017'), '31 March - 3 April, 2017');
  });

  it('returns a timestamp', () => {
    const timestamp = moment('03/10/2017', 'MM/DD/YYYY').format('x')
    assert.equal(date.toTimeStamp('03/10/2017'), timestamp);
  });

   
  it('returns an object with date fields formated', () => { 
    const eventDate = '03/10/2017';
    const eventEndDate = '03/11/2017';
    const timestamp = moment('03/10/2017', 'MM/DD/YYYY').format('x')
    assert.deepEqual(date.dates(eventDate, eventEndDate), {
                eventDates: '10-11 March, 2017',
                startDateTimestamp: timestamp,
                startDate: '10 March, 2017',
                endDate: '11 March, 2017'
            });
  });

  it('returns an object with date fields formated long range!', () => { 
    const eventDate = '01/09/2016';
    const eventEndDate = '05/31/2017';
    const timestamp = moment('01/09/2016', 'MM/DD/YYYY').format('x')
    assert.deepEqual(date.dates(eventDate, eventEndDate), {
                eventDates: '9 January - 31 May, 2017',
                startDateTimestamp: timestamp,
                startDate: '9 January, 2016',
                endDate: '31 May, 2017'
            });
  });  

  it('returns an object with date fields formated when there is no end date', () => { 
    const eventDate = '03/10/2017';
    const eventEndDate = false;
    const timestamp = moment('03/10/2017', 'MM/DD/YYYY').format('x')
    assert.deepEqual(date.dates(eventDate), {
                eventDates: '10 March, 2017',
                startDateTimestamp: timestamp,
                startDate: '10 March, 2017'
            });
  });

  it('is already passed', () => {  
    assert.isTrue(date.isAlreadyPassed('02/10/2017'));
  });
  
  it('is not already passed', () => {  
    assert.isFalse(date.isAlreadyPassed(moment().add(7, 'days').format('MM/DD/YYYY')));
  });

  it('Parses dates based on array of properties to parse', () => {
    const item = {
      text: 'This is a text that should stay intact',
      date: '03/10/2017',
      
      datesInObject: {
        date: 'this is named as a date but is not',
        text:'some text',
        deadline: '03/10/2017',
        notificationOfResults: "03/10/2017",
      },
      datesInArrayOfObjects: [{
        text:'some text',
        someDate: '03/10/2017',
        someOtherDate: "03/10/2017",
      },
      {
        text:'some text',
        someDate: '03/10/2017',
        someOtherDate: "03/10/2017",
      }]
    };
    const result = {
      text: 'This is a text that should stay intact',
      date: '10 March, 2017',
      datesInObject: {
        date:'this is named as a date but is not',
        text:'some text',
        deadline: '10 March, 2017',
        notificationOfResults: '10 March, 2017',
      },
      datesInArrayOfObjects: [{
        text:'some text',
        someDate: '10 March, 2017',
        someOtherDate: '10 March, 2017',
      },
      {
        text:'some text',
        someDate: '10 March, 2017',
        someOtherDate: '10 March, 2017',
      }]
    };
    const properties = ['date', 'deadline', 'notificationOfResults', 'someDate', 'someOtherDate'];
    assert.deepEqual(date.parseDates(item, properties), result);
  });

  it('is already passed (LEGACY)', () => {  
    assert.isNull(date.isAlreadyPassedLegacy('02/10/2017'));
  });
  
  it('is not already passed (LEGACY)', () => { 
    const nowInFuture = moment().add(7, 'days').format('MM/D/YYYY');
    assert.equal(date.isAlreadyPassedLegacy(
        moment()
        .add(7, 'days')
        .format('MM/DD/YYYY')), 
        date.ersDate(nowInFuture)
        );
  });

  it('checks if a date is valid', () =>{
    const string = "this is not a date";
    const dateTest = "03/10/2017";
    assert.isFalse(date.isValidDate(string));
    assert.deepEqual(date.isValidDate(dateTest), moment(dateTest, 'MM/DD/YYYY'));
  })

});