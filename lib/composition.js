const fp = require('./fp');
const date = require('./date');
const format = require('./format');
const _ = require('lodash');

module.exports = {
        formatProperties: (config) => {
            return fp.compose(
                date.setDates,
                format.title, 
                _.curryRight(date.parseDates)(config.dateProperties), 
                _.curryRight(format.setTypeColor)(config.sci)(config.scientificTypes),
                _.curryRight(format.setTypeColor)(config.edu)(config.educationTypes),
                _.curryRight(format.parseAttachements)(config.documents)(config.images)(config.baseUrl), 
                _.curryRight(format.markDownToHtml)(config.childrenToParse)(config.toParse));
    }
};