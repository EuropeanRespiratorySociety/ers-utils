const fp = require('./fp');
const date = require('./date');
const format = require('./format');
const _ = require('lodash');

module.exports = {
        formatProperties: (config, label) => {
            return fp.compose(
                format.title, 
                _.curryRight(date.parseDates)(config.dateProperties), 
                _.curryRight(format.setTypeColor)(label)(config.scientificTypes),
                _.curryRight(format.setTypeColor)(label)(config.educationTypes), 
                _.curryRight(format.parseAttachements)(config.documents)(config.images)(config.baseUrl), 
                _.curryRight(format.markDownToHtml)(config.childrenToParse)(config.toParse));
    }
};