/**
 * This is not intended to be a full library, it just extends
 * a little js. We tend to favor native function such as
 * map(), filter() and reduce() when available, this
 * are helpers that we add when becoming useful
 */
export default class Fp {

  compose(fn, ...rest) {
    return rest.length === 0 
      ? fn 
      : (...args) => {
        return fn(this.compose(...rest)(...args));
      };
  }

  /**
   * Curry functions
   */
  curry(fn, ...args1) {
    return (...args2) => fn(...args1, ...args2);
  }

  /**
   * returns a flatten array
   * @param {Array} array - array of arrays
   */
  concatAll(array) {
    let results = [];

    array.forEach(subArray => {
      subArray.forEach(i => { results.push(i); });
    });
    return results;
  }

  /**
   * @param {Array} left
   * @param {Array} right
   * @param {Function} combine
   */
  zip(left, right, combine) {
    let counter,
      results = [];

    for (counter = 0; counter < Math.min(left.length, right.length); counter++) {
      results.push(combine(left[counter], right[counter]));
    }
    return results;
  }
}
