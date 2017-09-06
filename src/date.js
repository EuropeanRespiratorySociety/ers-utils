import moment from 'moment';
import _ from 'lodash';

/**
 * @param {string} wouldBeDate
 * @param {boolean} timestamp
 * @return {Date|boolean}
 */
const isValidDate = (wouldBeDate) => {
  return moment(wouldBeDate, 'MM/DD/YYYY').isValid() ? moment(wouldBeDate, 'MM/DD/YYYY') : false;
};

/**
* Format a date according to the ERS Corporate Guidlines
* 12 February, 2017 || 12-14 Februrary, 2017 || 31 March - 3 April, 2017
*
* @param {string} start - format: DD/MM/YYYY
* @param {string} end - format: DD/MM/YYYY
* @param {boolean} timestamp
* @returns {string}
*/
const ersDate = (start, end, timestamp) => {
  end = end || false;
  timestamp = timestamp || false;

  const startDate = isValidDate(start, timestamp);
  const stringFormat = 'D MMMM, YYYY';

  if (startDate) {
    let endDate = isValidDate(end);

    if (end) {
      if (startDate.format('MMMM') !== endDate.format('MMMM')) {
        return startDate.format('D MMMM') + ' - ' + endDate.format(stringFormat);
      }

      if (startDate.format('MMMM') === endDate.format('MMMM')) {
        return startDate.date() + '-' + endDate.format(stringFormat);
      }
    }
    return startDate.format(stringFormat);
  }

  return start;
};

/**
 * Take a date string and returns a unix timestamp in milliseconds
 * @param {string} date
 * @returns {timestamp}
 */
const toTimeStamp = (date) => {
  return moment(date, 'MM/DD/YYYY').format('x');
};

/**
 * Sets some specific dates fields
 * @param {string} start - eventDate
 * @param {string} [end] - enventEndate
 */
const dates = (start, end) => {
  end = end || false;

  if (start && end) {
    return {
      eventDates: ersDate(start, end),
      startDateTimestamp: parseInt(toTimeStamp(start), 10),
      startDate: ersDate(start),
      endDate: ersDate(end)
    };
  }

  if (start && !end) {
    return {
      eventDates: ersDate(start),
      startDateTimestamp: parseInt(toTimeStamp(start), 10),
      startDate: ersDate(start)
    };
  }

  return false;
};

export default class DateUtils {

  constructor() {
    /**
     * Wraps moment, convinience method
     * It allows using moment if this
     * lib is imported.
     */
    this.moment = moment;
    this.ersDate = ersDate;
    this.isValidDate = isValidDate;
    this.dates = dates;
    this.toTimeStamp = toTimeStamp;
  }

  /**
  * Adds properties to handle the calendar
  * @param {Object} item
  * @returns {Object}
  */
  calendar(item) {
    const date = moment(item.eventDate, 'MM/DD/YYYY');
    const calendar = {
      calendar: {
        year: date.format('YYYY'),
        month: date.format('MMMM'),
        timestamp: date.unix()
      }
    };

    return Object.assign(item, calendar);
  }

  /**
   * Checks if an item belongs to the calendar
   * @param {Object|Object[]} category
   * @returns {boolean}
   */
  isCalendar(category) {
    if (!_.isArray(category) &&
      category.title === 'Events Calendar') {
      return true;
    }

    return _.isArray(category) &&
      !_.isUndefined(category.find(cat => cat.title === 'Events Calendar'));
  }

  /**
   * [Convinience method] Takes an item/article as input. Used for composition purposes
   * @param {Object} item
   * @return {Object}
   */
  setDates(item) { return Object.assign({}, item, dates(item.eventDate, item.eventEndDate)); }

  /**
   * Parse fields that have a date/dates
   * @param {Object} item - Article/Item Object
   * @param {Object[]} properties - properties to Parse
   * @return {Object}
   */
  parseDates(item, properties) {
    return _.mapValues(item, (v, k) => {
      if (_.indexOf(properties, k) !== -1) {
        return ersDate(v);
      }
      if (!_.isArray(v) && !_.isString(v) && !_.isBoolean(v)) {
        return _.mapValues(v, (v, k) => {
          return _.indexOf(properties, k) !== -1 ?
            ersDate(v) :
            v;
        });
      }
      if (_.isArray(v)) {
        return v.map(v => {
          return _.mapValues(v, (v, k) =>
            _.indexOf(properties, k) !== -1 ?
            ersDate(v) :
            v);
        });
      }
      return v;
    });
  }

  /**
   * Check if a date is already passed
   * @param {string} date
   * @returns {boolean}
   */
  isAlreadyPassed(date) {
    let now = moment();

    date = moment(date, 'MM/DD/YYYY');

    return date < now;

  }

  /**
   * [Deprecated] Check if a date is already passed
   * This is the legacy method it seems more logical to return a boolean
   * @param {string} date
   * @returns {mixed}
   */
  isAlreadyPassedLegacy(date) {
    let now = moment();
    let test = moment(date, 'MM/DD/YYYY');

    return now < test ? ersDate(date) : null;
  }

  /**
   * Order each item per year and then per month adding first a calendar property
   * @param {Object[]} array
   * @return {Object[]}
   */
  prepareCalendar(array) {
    return _.mapValues(
      _.groupBy(
      _.sortBy(array
          .filter(item => !this.isAlreadyPassed(item.eventDate))
          .map(item => this.calendar(item)), 'calendar.timestamp'),
      'calendar.year'),
    v => {
      return _.groupBy(v, 'calendar.month');
    });
  }
}

