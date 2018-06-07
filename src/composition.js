import Fp from './fp';
import Format from './format';
import DateUtils from './date';
import _ from 'lodash';

const fp = new Fp();
const date = new DateUtils();
const format = new Format();

export default class Composition {
  /**
   * Formats properties of an item/article.
   * This method is curried and takes an item/article when it is called
   * @param {Object} config
   * @param {boolean} type - parses to html
   * @return {Object} - item with formated properties
   */
  formatProperties(config, type = 'html') {
    const markDownToHtml = _.curryRight(format.parseContent)(false)(config.childrenToParse)(config.toParse);
    const raw = _.curryRight(format.parseContent)(true)(config.childrenToParse)(config.toParse);
    const parseAttachements = _.curryRight(format.parseAttachements)(config.documents)(config.images)(config.baseUrl);
    const setEducationTypeColor = _.curryRight(format.setTypeColor)(config.edu)(config.educationTypes);
    const setScientificTypeColor = _.curryRight(format.setTypeColor)(config.sci)(config.scientificTypes);
    const parseDates = _.curryRight(date.parseDates)(config.dateProperties);
    /* eslint-disable indent */
    return fp.compose(
      date.setDates,
      format.title,
      format.setFlags,
      format.setShortLead,
      parseDates,
      setScientificTypeColor,
      setEducationTypeColor,
      parseAttachements,
      type === 'raw'
      ? raw
      : type === 'markdown'
      ? item => item
      : markDownToHtml
    );
    /* eslint-enable indent */
  }
}


