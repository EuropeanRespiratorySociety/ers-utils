const fp = require('./fp');
const date = require('./date');
const format = require('./format');
const _ = require('lodash');

module.exports = {
    /**
     * Formats properties of an item/article.
     * This method is curried and takes an item/article when it is called
     * @param {Object} config
     * @return {Object} - item with formated properties
     */
    formatProperties: config => {
        const markDownToHtml = _.curryRight(format.markDownToHtml)(config.childrenToParse)(config.toParse);
        const parseAttachements = _.curryRight(format.parseAttachements)(config.documents)(config.images)(config.baseUrl);
        const setEducationTypeColor = _.curryRight(format.setTypeColor)(config.edu)(config.educationTypes);
        const setScientificTypeColor = _.curryRight(format.setTypeColor)(config.sci)(config.scientificTypes);
        const parseDates = _.curryRight(date.parseDates)(config.dateProperties);

        return fp.compose(
            date.setDates,
            format.title, 
            format.setFlags,
            format.setShortLead,
            parseDates, 
            setScientificTypeColor,
            setEducationTypeColor,
            parseAttachements, 
            markDownToHtml);
    }
};

