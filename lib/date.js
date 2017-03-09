'use strict';

const moment = require('moment');
const _ = require('lodash');

const self = module.exports = {
    
    /**
    * Adds properties to handle the calendar
    *
    * @param {string} date - format: DD/MM/YYYY
    * @returns {Object}
    */
    calendar: function(date) {
        date = moment(date, 'DD/MM/YYYY');
        return { 
            year: date.format('YYYY'), 
            month: date.format('MMMM'), 
            timestamp: date.format('x') 
        };
    },

    /**
     * Checks if an item belongs to the calendar
     * @param {Object|Object[]} category
     * @returns {boolean}
     */
    isCalendar: function(category) {

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
    ersDate: function(start, end) {
        end = end || false;

        if(start) {
            start = moment(start, 'DD/MM/YYYY');

            if(end) {
                end = moment(end, 'DD/MM/YYYY');

                if(start.format("MMMM") != end.format("MMMM")){
                    return start.format("D MMMM") + " - " + end.format("D MMMM, YYYY");
                }

                if(start.format("MMMM") == end.format("MMMM")){
                    return start.date() + "-" + end.format("D MMMM, YYYY");
                }
            }
            return start.format("D MMMM, YYYY");
        }
    },

    /**
     * Take a date string and returns a unix timestamp in milliseconds
     * @param {string} date
     * @returns {timestamp}
     */
    toTimeStamp: function(date) {
        return moment(date, 'DD/MM/YYYY').format('x');
    },

    /**
     * Sets some specific dates fields
     * @param {string} start - eventDate
     * @param {string} end - enventEndDate
     */
    dates: function(start, end) {
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
     * Check if a date is already passed 
     * @param {string} date 
     * @returns {boolean}
     */
    isAlreadyPassed: function(date) {
        let now = moment();
        date = moment(date, 'DD/MM/YYYY');

        return date < now ? true : false;

    },

    /**
     * Check if a date is already passed 
     * This is the legacy method it seems more logical to return a boolean
     * @param {string} date 
     * @returns {mixed}
     */
    isAlreadyPassedLegacy: function(date) {
        let now = moment();
        let test = moment(date, 'DD/MM/YYYY');

        return now < test ? this.ersDate(date) : null;

    }

}