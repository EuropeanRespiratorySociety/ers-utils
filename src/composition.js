import Fp from './fp';
import Format from './format';
import DateUtils from './date';
import l from 'lodash';

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
  formatProperties(config, type) {
    type = type || 'html';
    const markDownToHtml = l.curryRight(format.parseContent)(false)(config.childrenToParse)(config.toParse);
    const raw = l.curryRight(format.parseContent)(true)(config.childrenToParse)(config.toParse);
    const parseAttachements = l.curryRight(format.parseAttachements)(config.documents)(config.images)(config.baseUrl);
    const setEducationTypeColor = l.curryRight(format.setTypeColor)(config.edu)(config.educationTypes);
    const setScientificTypeColor = l.curryRight(format.setTypeColor)(config.sci)(config.scientificTypes);
    const parseDates = l.curryRight(date.parseDates)(config.dateProperties);

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
  }
}


