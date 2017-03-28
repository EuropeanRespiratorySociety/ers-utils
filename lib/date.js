'use strict';

const moment = require('moment');
const _ = require('lodash');

const self = module.exports = {
    
    /**
    * Adds properties to handle the calendar
    *
    * @param {Object} item 
    * @returns {Object}
    */
    calendar: item => {
        console.log("date 1", item.eventDate);
        const date = moment(item.eventDate, 'MM/DD/YYYY');
        console.log("date 2", date);
        const calendar =  {
            calendar:{ 
                year: date.format('YYYY'), 
                month: date.format('MMMM'), 
                timestamp: date.unix() 
            }
        };
        return Object.assign(item, calendar);
    },

    /**
     * Checks if an item belongs to the calendar
     * @param {Object|Object[]} category
     * @returns {boolean}
     */
    isCalendar: category => {

        if(!_.isArray(category) 
            && category.title == "Events Calendar"){
            return true;
        }
        
        return _.isArray(category) 
                && !_.isUndefined(category.find(cat => cat.title == "Events Calendar")) 
                ? true : false;

    },

    /**
    * Format a date according to the ERS Corporate Guidlines
    * 12 February, 2017 || 12-14 Februrary, 2017 || 31 March - 3 April, 2017
    *
    * @param {string} $start - format: DD/MM/YYYY
    * @param {string} $end - format: DD/MM/YYYY
    * @returns {string}
    */
    ersDate: (start, end) => {
        end = end || false;
        const startDate = self.isValidDate(start);

        if(startDate) {
            let endDate = self.isValidDate(end);
            if(end) {
                

                if(startDate.format("MMMM") != endDate.format("MMMM")){
                    return startDate.format("D MMMM") + " - " + endDate.format("D MMMM, YYYY");
                }

                if(startDate.format("MMMM") == endDate.format("MMMM")){
                    return startDate.date() + "-" + endDate.format("D MMMM, YYYY");
                }
            }
            return startDate.format("D MMMM, YYYY");
        }

        return start;
    },

    /**
     * Take a date string and returns a unix timestamp in milliseconds
     * @param {string} date
     * @returns {timestamp}
     */
    toTimeStamp: date => {
        return moment(date, 'MM/DD/YYYY').format('x');
    },

    /**
     * Sets some specific dates fields
     * @param {string} start - eventDate
     * @param {string} [end] - enventEndate
     */
    dates: (start, end) =>{
        end = end || false;
        if(start && end) {
            return {
                eventDates: self.ersDate(start, end),
                startDateTimestamp: self.toTimeStamp(start),
                startDate: self.ersDate(start),
                endDate: self.ersDate(end)
            };
        }
        
        if(start && !end){
            return {
                eventDates: self.ersDate(start),
                startDateTimestamp: self.toTimeStamp(start),
                startDate: self.ersDate(start)
            }
        }
    },

    /**
     * Parse fields that have a date/dates
     * @param {Object} item - Article/Item Object
     * @param {Object[]} properties - properties to Parse
     * @return {Object}
     */
    parseDates: (item, properties) => {
        return _.mapValues(item, (v, k) => {
            if(_.indexOf(properties, k) != -1 ) {
                return self.ersDate(v) 
            }
            if(!_.isArray(v) && !_.isString(v)) {
                    return _.mapValues(v, (v,k) => { 
                        return _.indexOf(properties, k) != -1 ? 
                            self.ersDate(v) : 
                            v
                    })
            }

            if(_.isArray(v)) {
                    return v.map(v => { 
                        return _.mapValues(v, (v, k) => 
                            _.indexOf(properties, k) != -1 ? 
                            self.ersDate(v) : 
                            v  )
                    })
            }

            return v;
        });
    },

    /**
     * Check if a date is already passed 
     * @param {string} date 
     * @returns {boolean}
     */
    isAlreadyPassed: date => {
        let now = moment();
        date = moment(date, 'MM/DD/YYYY');

        return date < now ? true : false;

    },

    /**
     * Check if a date is already passed 
     * This is the legacy method it seems more logical to return a boolean
     * @param {string} date 
     * @returns {mixed}
     */
    isAlreadyPassedLegacy: date => {
        let now = moment();
        let test = moment(date, 'MM/DD/YYYY');

        return now < test ? self.ersDate(date) : null;

    },

    /**
     * @param {string} wouldBeDate
     * @return {Date|boolean}
     */
    isValidDate: wouldBeDate => {
        return moment(wouldBeDate, 'MM/DD/YYYY').isValid() ? moment(wouldBeDate, 'MM/DD/YYYY') : false;
    }

}