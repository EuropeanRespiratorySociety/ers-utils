import { reverse } from 'dns';
import { assert, expect } from 'chai';

const moment = require('moment');
const D = require('../../lib/library.min').DateUtils;
const date = new D();

describe('Date Util', function () {
  it('returns an object with calendar properties set', () => {
    const mockDate = moment().add(7,'days');
    const dateString = mockDate.format('MM/DD/YYYY');
    const mockDateFromString = moment(dateString, 'MM/DD/YYYY') //We need to do this for the timestamp to be exactly the same
    const item = {
      title: "This is an item title", 
      eventDate: dateString,
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ]
    };
    const object = {
      title: "This is an item title",
      eventDate: dateString,
      calendar: { 
        year: mockDateFromString.format('YYYY'), 
        month: mockDateFromString.format('MMMM'), 
        timestamp: mockDateFromString.unix()
      },
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ],  
    };
    const res = date.calendar(item);
    assert.deepEqual(res, object);
  });

  it('does not create a calendar object', () => {
    const item = {
      title: "This is an item title", 
      eventDate: false,
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ]
    };
    const object = {
      title: "This is an item title",
      eventDate: false,
      calendar: false,
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ]
    };
    const res = date.calendar(item);
    expect(res.calendar).to.be.undefined;
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
    const arrayOfStrings = [
      'should not be parsed',
      'this either',
    ];

    assert.isTrue(date.isCalendar(object));
    assert.isTrue(date.isCalendar(arrayOfObjects));
    assert.isFalse(date.isCalendar(emptyObj));
    assert.isFalse(date.isCalendar(arrayOfStrings));
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

    const arrayOfStrings = [
      'should not be parsed',
      'this either',
    ];
        
    assert.isFalse(date.isCalendar(object));
    assert.isFalse(date.isCalendar(arrayOfObjects));
    assert.isFalse(date.isCalendar(arrayOfStrings));
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
                startDateTimestamp: parseInt(timestamp),
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
                startDateTimestamp: parseInt(timestamp),
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
                startDateTimestamp: parseInt(timestamp),
                startDate: '10 March, 2017'
            });
  });

  it('sets dates to an object', () => {
    const timestamp = moment('03/10/2017', 'MM/DD/YYYY').format('x')
    const item = {
      title: 'This is a title',
      eventDate: '03/10/2017',
      eventEndDate: false
    }
    const result = {
      title: 'This is a title',
      eventDate: '03/10/2017',
      eventDates: '10 March, 2017',
      startDateTimestamp: parseInt(timestamp),
      startDate: '10 March, 2017',
      eventEndDate: false
    }
    assert.deepEqual(date.setDates(item), result)
  })

  it('is already passed', () => {  
    assert.isTrue(date.isAlreadyPassed('02/10/2017'));
  });
  
  it('is not already passed', () => {  
    assert.isFalse(date.isAlreadyPassed(moment().add(7, 'days').format('MM/DD/YYYY')));
  });


  it('is already passed filters out wrong dates', () => {  
    assert.isTrue(date.isAlreadyPassed(false));
  });

  it('Parses dates based on array of properties to parse', () => {
    const item = {
      text: 'This is a text that should stay intact',
      date: '03/10/2017',
      boolean: true,  
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
      }],
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ]
    };
    const result = {
      text: 'This is a text that should stay intact',
      date: '10 March, 2017',
      boolean: true,
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
      }],
      arrayOfStrings: [
        'should not be parsed',
        'this either',
      ]
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

  it('checks if a date is valid', () => {
    const string = "this is not a date";
    const dateTest = "03/10/2017";
    assert.isFalse(date.isValidDate(string));
    assert.deepEqual(date.isValidDate(dateTest), moment(dateTest, 'MM/DD/YYYY'));
  });

  it('returns a formated calendar timeline', () => {
    const minusAWeek = moment().subtract(7, "days");
    const plusAWeek = moment().add(7, "days");
    const plusTwoMonths = moment().add(2, "months");
    const plusAYear = moment().add(1, "year");
    const array = [
      {
        title: "title 1",
        eventDate: minusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 2",
        eventDate: plusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 3",
        eventDate: plusTwoMonths.format('MM/DD/YYYY')
      },
      {
        title: "title 4",
        eventDate: plusAYear.format('MM/DD/YYYY')
      },
      {
        title: "title 5",
        eventDate: false
      }
    ];
  
    const result = date.timeline(array);
    expect(result).to.be.an('object');
    expect(result).to.have.property(`${plusAWeek.format('YYYY')}`)
      .to.have.property(`${[plusAWeek.format('MMMM')]}`)
      .to.be.an('array');
    expect(result).to.have.property(`${plusAYear.format('YYYY')}`)
      .to.have.property(`${[plusAYear.format('MMMM')]}`)
      .to.be.an('array');
    expect(result[`${plusAWeek.format('YYYY')}`][`${[plusAWeek.format('MMMM')]}`])
      .to.deep.include({
        title: "title 2",
        eventDate: plusAWeek.format('MM/DD/YYYY'),
        calendar: {
          year: `${plusAWeek.format('YYYY')}`,
          month: `${plusAWeek.format('MMMM')}`,
          timestamp: moment(plusAWeek.format('MM/DD/YYYY'), 'MM/DD/YYYY').unix()
        }
      });
  });

  it('does not return any timeline items', () => {    
    const array = [
      {
        title: "title 5",
        eventDate: false
      }
    ];

    const result = date.timeline(array);
    expect(result).to.be.empty;
  })

  it('returns sorted and filtered calendar items', () => {
    const minusAWeek = moment().subtract(7, "days");
    const plusAWeek = moment().add(7, "days");
    const plusTwoMonths = moment().add(2, "months");
    const plusAYear = moment().add(1, "year");
    const array = [
      {
        title: "title 1",
        eventDate: minusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 4",
        eventDate: plusAYear.format('MM/DD/YYYY')
      },
      {
        title: "title 3",
        eventDate: plusTwoMonths.format('MM/DD/YYYY')
      },
      {
        title: "title 2",
        eventDate: plusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 5",
        eventDate: false
      }
    ];
  
    const result = date.prepareCalendar(array);
    expect(result).to.be.an('array').to.have.lengthOf(3);
    expect(result[0]).to.be.an('object').to.include({title: "title 2"});
    expect(result[2]).to.be.an('object').to.include({title: "title 4"});

  });

  it('returns sorted (reverse order) and filtered calendar items', () => {
    const minusAWeek = moment().subtract(7, "days");
    const plusAWeek = moment().add(7, "days");
    const plusTwoMonths = moment().add(2, "months");
    const plusAYear = moment().add(1, "year");
    const array = [
      {
        title: "title 1",
        eventDate: minusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 4",
        eventDate: plusAYear.format('MM/DD/YYYY')
      },
      {
        title: "title 3",
        eventDate: plusTwoMonths.format('MM/DD/YYYY')
      },
      {
        title: "title 2",
        eventDate: plusAWeek.format('MM/DD/YYYY')
      },
      {
        title: "title 5",
        eventDate: false
      }
    ];

    const reversed = date.prepareCalendar(array, true);
    expect(reversed).to.be.an('array').to.have.lengthOf(3);
    expect(reversed[0]).to.be.an('object').to.include({title: "title 4"});
    expect(reversed[2]).to.be.an('object').to.include({title: "title 2"});

  });

  it('wraps moment', () => {
    const someDate = moment();
    const formated = someDate.format('D MMMM, YYYY');

    assert.equal(moment.isMoment(date.moment()), moment.isMoment(someDate));
    assert.equal(date.moment().format('D MMMM, YYYY'), formated);
  });
});
